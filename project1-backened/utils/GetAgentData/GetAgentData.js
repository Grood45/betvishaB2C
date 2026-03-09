const agentData=require("../../currencyWithAgentData.json")
const GetAgentData=(currency)=>{
const key=currency
return agentData[key] || "";
}
module.exports={GetAgentData}