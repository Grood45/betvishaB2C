import React from 'react'
import Home from '../page/Home'
import { Route, Routes } from 'react-router-dom'
import Sport from '../page/Sport'
 import VipPage from '../page/VipPage'
 import Casino from '../page/Casino'

import Promotion from '../page/Promotion'
import Faq from '../page/Faq'
import PrivacyPolicy from '../page/PrivacyPolicy'
import TermConditions from '../page/TermsCondition'
import DisconnectionPolicy from '../page/DisconnectionPolicy'
import Responsible from '../page/Responsible'
import InfoAndPayment from '../page/InfoAndPayment';
import Account from '../page/Account'
import MobileLeftSideBar from '../modal/MobileLeftSideBar'
import Deposit from '../page/Deposit'
import Upi from '../component/deposit-component/Upi'
import InfoMobileHeader from '../component/InfoMobileHeader'
import ChangePassword from '../component/All-Page-Tabs/Account-component/ChangePassword'
import ContactUs from '../page/ContactUs'
import Wallet from '../page/Wallet';
import Inbox from '../page/Inbox';
import  BankAccountForm from '../page/BankAccountForm' 
import WithDraw from '../page/WithDraw'
import Records from '../page/Records'
import Payment from '../page/Payment'
import Profile from '../component/All-Page-Tabs/Account-component/Profile'
import ReferAndEarn from '../page/ReferAndEarn'
import GameCategory from '../component/GameCategory/GameCategory'
import IframeView from '../component/GameCategory/IframeView'
import BetRecords from '../page/BetRecords'
import AffilatePage from '../page/AffilaitePage'


const AllRoute = () => {
  return (
  
    <Routes >
      <Route path="/"  element={<Home/>}/>
      <Route path="/payment" element={<Payment/>} />
      <Route path="/Sports"  element={<Sport/>}/>
      <Route path="/Profile"  element={<Profile/>}/>


      <Route path="/vip-page"  element={<VipPage/>}/>
      <Route path="/casino-games"  element={<Casino/>}/>
      <Route path="/Promotion"  element={<Promotion/>}/>
      <Route path="/VIP"  element={<VipPage/>}/>
      <Route path="/faq"  element={<Faq/>}/>
      <Route path="/PrivacyPolicy"  element={<PrivacyPolicy/>}/>
      <Route path="/terms-and-conditions"  element={<TermConditions/>}/>
      <Route path="/Disconnection-Policy"  element={<DisconnectionPolicy/>}/>
      <Route path="/Responsible-Gambling"  element={<Responsible/>}/>
      <Route path="/InfoAndPayment"  element={<InfoAndPayment/>}/>
      <Route path="/Account"  element={<Account/>}/>
      <Route path="/ChangePassword"  element={<ChangePassword/>}/>
      <Route path="/MobileLeftSideBar"  element={<MobileLeftSideBar/>}/>
      <Route path="/Deposit"  element={<Deposit/>}/>
      <Route path="/upi"  element={<Upi/>}/>
      <Route path="/InfoMobileHeader"  element={<InfoMobileHeader/>}/>
      <Route path="/contact-us"  element={<ContactUs/>}/>
      <Route path="/Wallet"  element={<Wallet/>}/>
      <Route path="/Inbox"  element={<Inbox/>}/>
      <Route path="/Bank"  element={<BankAccountForm/>}/>
      <Route path="/WithDraw"  element={<WithDraw/>}/>
      <Route path="/Records"  element={<Records/>}/>
      <Route path="/bet-records"  element={<BetRecords/>}/>
      <Route path="/affiliate-program" element={<AffilatePage/>} />

      <Route path="/Referral" element={<ReferAndEarn/>} />

      <Route path="/game-category/:id/:name" element={<GameCategory/>} />
      <Route path="/casino/top-rated-games/:name" element={<GameCategory/>} />

      <Route path="/iframe-view/:gp_id/:game_id" element={<IframeView/>} />
     
    </Routes>
  )
}

export default AllRoute