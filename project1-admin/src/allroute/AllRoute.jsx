import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import NewUser from '../pages/NewUser';
import ManualUser from '../pages/ManualUser';
import UserManage from '../pages/UserManage';
import NoDepositUser from '../pages/NoDepositUser';

// ... existing imports ...

import SportManage from '../pages/SportManage';
import AdminManage from '../pages/AdminManage';
import CasinoManage from '../pages/CasinoManage';
import SingleUserManage from '../pages/SingleUserManage';
import DepositManage from '../pages/DepositManage';
import WithDrawlManage from '../pages/WithDrawlManage';
import Transaction from '../pages/AdminTransaction';
import SingleAdminManage from '../pages/SingleAdminManage';
import BetReport from '../pages/BetReport';
import GeneralSettings from '../pages/GeneralSettings';
import ManualDeposit from '../pages/ManualDeposit';
import AutoDeposit from '../pages/AutoDeposit';
import ManualWithdrawal from '../pages/ManualWithdrawal';
import AutoWithdrawal from '../pages/AutoWithdrawal';
import LiveReport from '../pages/LiveReport';
import ProfitLossByUser from '../pages/report/ProfitLossByUser';
import MyProfile from '../pages/MyProfile';
import Signin from '../pages/Signin';
import AdminSetting from '../pages/AdminSetting';
import BlockMarket from '../pages/BlockMarket';
import LayerManage from '../pages/LayerManage';
import ReferralSetting from '../pages/ReferralSetting';
import PromotionManage from '../pages/PromotionManage';
import GenerateAmountReport from '../pages/report/GenerateAmountReport';
import LogoBanner from '../pages/LogoBanner';
import DownlineWithdrawal from '../pages/DownlineWithdrawal';
import DownlineDeposit from '../pages/DownlineDeposit';
import BonusHistory from '../pages/BonusHistory';
import BonusContribution from '../pages/BonusContribution';
import AllUser from '../pages/AllUser';
import AllAdmin from '../pages/AllAdmin';
import UserTransaction from '../pages/UserTransaction';
import UserWithdrawal from '../pages/UserWithdrawal';
import UserDeposit from '../pages/UserDeposit';
import AdminTransaction from '../pages/AdminTransaction';
import ManageGames from '../pages/ManageGames';
import FooterContent from '../pages/FooterContent';
import SeoManage from '../pages/SeoManage';
import ProfitLossByGGR from '../pages/report/ProfitLossByGGR';
import ProfitLossByGame from '../pages/report/ProfitLossReportByGame';
import SiteManage from '../pages/SiteManage';
import DeletedUserManage from '../pages/DeletedUserManage';
import QuickLinksManage from '../pages/QuickLinksManage';
import { useSelector } from 'react-redux';

const routes =
  [
    { path: '/login', component: Signup },
    // { path: '/signup', component: Signup },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/', component: Home },
    { path: '/usermanage', component: UserManage, permission: 'userView' },
    { path: '/new-user', component: NewUser, permission: 'userView' },
    { path: '/manual-user', component: ManualUser, permission: 'userView' },
    { path: '/no-deposit-user', component: NoDepositUser, permission: 'userView' },
    { path: '/usermanage/:id', component: SingleUserManage, permission: 'userView' },
    { path: '/deleted-user-manage', component: DeletedUserManage, permission: 'userView' },
    { path: '/my-profile', component: MyProfile },
    { path: '/9wicket', component: NineWicketManage, permission: 'providerView' },
    { path: '/powersport', component: PowerPlayManage, permission: 'providerView' },
    { path: '/sportmanage', component: SportManage, permission: 'sportView' },
    { path: '/adminmanage', component: AdminManage, permission: 'adminView' },
    { path: '/adminmanage/:id', component: SingleAdminManage, permission: 'adminView' },
    { path: '/all-user', component: AllUser, permission: 'allUserView' },
    { path: '/all-admin', component: AllAdmin, permission: 'allAdminView' },
    { path: '/casinomanage', component: CasinoManage, permission: 'providerView' },
    { path: '/casinomanage/:gameName/:gpId', component: ManageGames, permission: 'providerView' },
    { path: '/user-withdrawal', component: UserWithdrawal, permission: "userWithdrawView" },
    { path: '/user-deposit', component: UserDeposit, permission: "userDepositView" },
    { path: '/user-transaction', component: UserTransaction, permission: 'userTransactionView' },
    { path: '/admin-upline-withdrawal', component: WithDrawlManage, permission: "uplineWithdrawView" },
    { path: '/admin-downline-withdrawal', component: DownlineWithdrawal, permission: "downlineWithdrawView" },
    { path: '/admin-upline-deposit', component: DepositManage, permission: 'uplineDepositView' },
    { path: '/admin-downline-deposit', component: DownlineDeposit, permission: "downlineDepositView" },
    { path: '/admin-transaction', component: AdminTransaction, permission: "adminTransactionView" },
    { path: '/bet-history', component: BetReport, permission: 'betHistoryView' },
    { path: '/sport-bet-history', component: SportBetHistory, permission: 'betHistoryView' },


    { path: '/affilate-admin-manage', component: AffilateAdminManage, permission: 'betHistoryView' },
    { path: '/affilate-transaction', component: AffilateTransaction, permission: 'betHistoryView' },
    { path: '/upload-affilate', component: CreateAffilate, permission: 'betHistoryView' },
    { path: '/affilate-manage/:id', component: SingleAffilateManage, permission: 'userView' },



    { path: '/live-report', component: LiveReport, permission: "liveBetView" },
    { path: '/social-setting', component: AdminSetting, permission: "socialMediaView" },
    { path: '/layer-manage', component: LayerManage, permission: "layerManageView" },
    { path: '/referral-setting', component: ReferralSetting, permission: "referralSettingView" },
    { path: '/promotion-manage', component: PromotionManage, permission: "bonusHistoryView" },
    { path: '/logo-banner', component: LogoBanner, permission: "logoBannerView" },
    { path: '/footer-data', component: FooterContent, permission: "footerContentView" },
    { path: '/seo-manage', component: SeoManage, permission: "seoView" },
    { path: '/quick-links', component: QuickLinksManage, permission: "seoView" },
    { path: '/site-manage', component: SiteManage, permission: "siteView" },
    { path: '/bonus-history', component: BonusHistory, permission: 'bonusHistoryView' },
    { path: '/bonus-manage', component: BonusContribution, permission: "bonusView" },
    { path: '/refer-earn', component: ReferAndEarn, permission: "referEarn" },
    { path: '/vip-level', component: VipLevel, permission: "vipLevel" },
    { path: '/block-market', component: BlockMarket, permission: 'blockMarketView' },
    { path: '/manual-deposit-getway', component: ManualDeposit, permission: "manualDepositView" },
    { path: '/auto-deposit-getway', component: AutoDeposit, permission: "autoDepositView" },
    { path: '/manual-withdrawal-getway', component: ManualWithdrawal, permission: "manualWithdrawView" },
    { path: '/auto-withdrawal-getway', component: AutoWithdrawal, permission: "autoWithdrawView" },
    { path: '/player-wise-report', component: ProfitLossByUser, permission: "playerWiseReportView" },
    { path: '/game-wise-report', component: ProfitLossByGame, permission: "gameReportView" },
    { path: '/ggr-wise-report', component: ProfitLossByGGR, permission: 'ggrReportView' },
    { path: '/generate-amount-report', component: GenerateAmountReport, permission: "generateAmountView" },
    { path: '/login-history', component: LoginHistory },
    { path: '/player-login-history', component: PlayerLoginHistory },
    { path: '/user-graph', component: UserGraph },
    { path: '/user-join-graph', component: UserJoinGraph },
  ];

import UserGraph from '../pages/UserGraph';
import UserJoinGraph from '../pages/UserJoinGraph';



import PermissionWrapper from './PermissionWrapper';
import ReferAndEarn from '../pages/ReferAndEarn';
import VipLevel from '../pages/VipLevel';
import Signup from '../pages/Signup';
import LoginHistory from '../pages/LoginHistory';
import PlayerLoginHistory from '../pages/PlayerLoginHistory';
import { components } from 'react-select';
import AddDataProvider from '../Modals/AddDataProvider';
import EditDataProvider from '../Modals/EditDataProvider';
import DataProvider from '../Modals/DataProvider';
import SportBetHistory from '../pages/SportBetHistory';
import AffilateAdminManage from '../pages/AffilateAdminManage';
import AffilateTransaction from '../pages/AffilateTransaction';
import CreateAffilate from '../pages/CreateAffilate';
import SingleAffilateManage from '../pages/SingleAffilateManage';
import NineWicketManage from '../pages/NineWicketManage';
import PowerPlayManage from '../pages/PowerPlayManage';
const AllRoute = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.permission
              ? <PermissionWrapper component={route.component} permissionName={route.permission} />
              : <route.component />
          }
        />
      ))}
    </Routes>
  );
};

export default AllRoute;
// Force refresh

