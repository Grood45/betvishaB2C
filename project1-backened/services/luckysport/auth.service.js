const axios = require('axios');
const { SportSetupModel } = require('../../models/providers/sportsetup.model');

/**
 * LuckySport Authentication Service
 * Following 20-year developer standards: Managed tokens, auto-refresh, and robust error handling.
 */
class LuckySportAuthService {
    constructor() {
        this.idToken = null;
        this.tokenExpiry = null;
        this.refreshThreshold = 5 * 60 * 1000; // Refresh 5 minutes before expiry
        this.isRefreshing = false;
        this.refreshPromise = null;
    }

    /**
     * Get a valid idToken. Refreshes if expired or missing.
     */
    async getIdToken() {
        if (this.idToken && this.tokenExpiry && Date.now() < (this.tokenExpiry - this.refreshThreshold)) {
            return this.idToken;
        }

        // Concurrency Lock: If already refreshing, wait for the same promise
        if (this.isRefreshing) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.refreshIdToken().finally(() => {
            this.isRefreshing = false;
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    /**
     * Call mDocs /GetIDToken API to fetch a new token with Retry Logic
     */
    async refreshIdToken(retries = 3, backoff = 1000) {
        try {
            const setup = await SportSetupModel.findOne({ provider_name: 'LuckySport' });

            if (!setup || !setup.cert_key) {
                throw new Error("LuckySport API Key (cert_key) is not configured.");
            }

            const apiKey = setup.cert_key;
            // Using Uni247 Production/Staging URL as per docs
            const url = `https://mtauth.uni247.xyz/GetIDToken?key=${apiKey}`;

            const response = await axios.post(url);

            if (response.data && response.data.idToken) {
                this.idToken = response.data.idToken;
                this.tokenExpiry = Date.now() + (60 * 60 * 1000);
                console.log("[LuckySport] idToken refreshed successfully.");
                return this.idToken;
            } else {
                throw new Error(response.data.message || "Invalid response from LuckySport");
            }
        } catch (error) {
            if (retries > 0) {
                console.warn(`[LuckySport Auth] Refresh failed. Retrying in ${backoff}ms... (${retries} retries left)`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return this.refreshIdToken(retries - 1, backoff * 2);
            }
            console.error("[LuckySport Auth Critical]:", error.message);
            throw new Error(`LuckySport Authentication Failed after retries: ${error.message}`);
        }
    }

    /**
     * Fetch Live Merchant Quota/Balance from Lucky Sport
     */
    async getMerchantQuota() {
        try {
            const idToken = await this.getIdToken();
            const setup = await SportSetupModel.findOne({ provider_name: 'LuckySport' });

            if (!setup || !setup.merchant_code) throw new Error("MERCHANT_CONFIG_MISSING");

            // URL based on master API documentation
            const response = await axios.post('https://mtauth.uni247.xyz/GetMerchantQuota', {
                merchant_code: setup.merchant_code
            }, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });

            if (response.data && response.data.quota !== undefined) {
                return response.data.quota; // Assuming quota is returned as a number
            }
            throw new Error(response.data.message || "Failed to fetch quota");
        } catch (error) {
            console.error("[LuckySport Auth] Error fetching merchant quota:", error.message);
            throw error;
        }
    }
}

// Export as a Singleton to share the token across all requests
module.exports = new LuckySportAuthService();
