const { SportSetupModel } = require("../../models/providers/sportsetup.model");

// Upsert (Create or Update) sports provider setup
const upsertSportSetup = async (req, res) => {
    try {
        const { provider_name, cert_key, agent_code, merchant_code, jwt_secret, status, callback_url, provider_image, provider_logo, sport_images, is_maintenance, is_coming_soon, maintenance_display_type, coming_soon_display_type } = req.body;

        if (!provider_name) {
            return res.status(400).json({ status: 400, success: false, message: "Provider name is required" });
        }

        // Find if setting already exists for this provider
        let setup = await SportSetupModel.findOne({ provider_name });

        if (setup) {
            // Update
            if (cert_key !== undefined) setup.cert_key = cert_key;
            if (agent_code !== undefined) setup.agent_code = agent_code;
            if (merchant_code !== undefined) setup.merchant_code = merchant_code;
            if (jwt_secret !== undefined) setup.jwt_secret = jwt_secret;
            if (status !== undefined) setup.status = status;
            setup.callback_url = callback_url || ""; // Always update or set to empty if not provided
            if (provider_image !== undefined) setup.provider_image = provider_image;
            if (provider_logo !== undefined) setup.provider_logo = provider_logo;
            if (sport_images !== undefined) setup.sport_images = sport_images;
            if (is_maintenance !== undefined) setup.is_maintenance = is_maintenance;
            if (maintenance_display_type !== undefined) setup.maintenance_display_type = maintenance_display_type;
            if (is_coming_soon !== undefined) setup.is_coming_soon = is_coming_soon;
            if (coming_soon_display_type !== undefined) setup.coming_soon_display_type = coming_soon_display_type;

            await setup.save();
            return res.status(200).json({ status: 200, success: true, message: "Sport setup updated successfully", data: setup });
        } else {
            // Create
            setup = new SportSetupModel({
                provider_name,
                cert_key: cert_key || "",
                agent_code: agent_code || "",
                merchant_code: merchant_code || "",
                jwt_secret: jwt_secret || "",
                status: status || false,
                callback_url: callback_url || "",
                provider_image: provider_image || "",
                provider_logo: provider_logo || "",
                sport_images: sport_images || [],
                is_maintenance: is_maintenance || false,
                maintenance_display_type: maintenance_display_type || "alert",
                is_coming_soon: is_coming_soon || false,
                coming_soon_display_type: coming_soon_display_type || "alert"
            });
            await setup.save();
            return res.status(201).json({ status: 201, success: true, message: "Sport setup created successfully", data: setup });
        }
    } catch (error) {
        console.error("Error upserting sport setup:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal server error", error: error.message });
    }
};

// Get sport setup by provider name
const getSportSetup = async (req, res) => {
    try {
        const { provider_name } = req.params;
        const setup = await SportSetupModel.findOne({ provider_name });

        if (!setup) {
            return res.status(200).json({ status: 200, success: true, data: null, message: "Sport setup not found" });
        }

        return res.status(200).json({ status: 200, success: true, data: setup });
    } catch (error) {
        console.error("Error getting sport setup:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal server error", error: error.message });
    }
};

// Get active sport providers
const getActiveSportProviders = async (req, res) => {
    try {
        const activeProviders = await SportSetupModel.find({ status: true }).select('provider_name callback_url provider_image provider_logo sport_images is_maintenance is_coming_soon maintenance_display_type coming_soon_display_type');
        return res.status(200).json({ status: 200, success: true, data: activeProviders });
    } catch (error) {
        console.error("Error getting active sport providers:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal server error" });
    }
};

module.exports = {
    upsertSportSetup,
    getSportSetup,
    getActiveSportProviders
};
