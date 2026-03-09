import React from 'react';
import { Badge } from "@chakra-ui/react";
import { formatDate } from "../../utils/utils";
import { motion } from 'framer-motion';

const BetCards = ({ data, border, iconColor }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariant = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
        >
            {data &&
                data.map((item) => {
                    const isWin = item.WinLoss !== "0";
                    const isRunning = item.Status === "running";

                    return (
                        <motion.div
                            key={item?._id}
                            variants={itemVariant}
                            style={{ border: `1px solid ${border}` }}
                            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 group relative border-gray-100/50 backdrop-blur-sm"
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-5 min-w-[240px]">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:rotate-6 transition-transform duration-500 ring-4 ring-blue-50">
                                            {item?.Username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${isRunning ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-extrabold text-gray-900 text-base tracking-tight">{item?.Username}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase opacity-80 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {formatDate(item?.BetTime?.split(" ")[0])}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Game Detail Section */}
                                <div className="flex-1 flex flex-col md:flex-row items-center gap-5 w-full bg-slate-100/40 p-4 rounded-2xl border border-gray-200/60 shadow-inner">
                                    <div className="flex flex-col items-center md:items-start min-w-[120px]">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Live Provider</span>
                                        <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-xl shadow-lg border-b-2 border-indigo-800 uppercase tracking-tighter">{item?.Provider}</span>
                                    </div>
                                    <div className="hidden md:block h-10 w-[1px] bg-gray-300/50" />
                                    <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Event Details</span>
                                        <span className="text-sm font-bold text-gray-800 truncate w-full tracking-tight px-1">{item?.GameName || "Standard Table"}</span>
                                    </div>
                                </div>

                                {/* Result & Pulse Section */}
                                <div className="flex items-center gap-8 min-w-[280px] justify-between w-full lg:w-auto pl-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Payout Result</span>
                                        <div className="flex items-baseline gap-2.5">
                                            <span className="text-xs font-bold text-gray-300 line-through tracking-tighter italic">₹{item.Amount?.toFixed(1)}</span>
                                            <span className={`text-2xl font-black tracking-tighter drop-shadow-sm ${isRunning ? "text-orange-500" : isWin ? "text-emerald-600" : "text-rose-600"}`}>
                                                ₹{isRunning ? "0" : isWin ? (parseFloat(item.WinLoss) + parseFloat(item.Amount)).toFixed(2) : item.Amount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2.5">
                                        <Badge
                                            px={5}
                                            py={2}
                                            borderRadius="2xl"
                                            fontSize="11px"
                                            fontWeight="black"
                                            variant="solid"
                                            colorScheme={isRunning ? "orange" : isWin ? "green" : "red"}
                                            boxShadow="lg"
                                            className="scale-110 ring-4 ring-white"
                                        >
                                            {isRunning ? "Running" : isWin ? "WINNER" : "LOSS"}
                                        </Badge>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-orange-400 animate-ping" : isWin ? "bg-emerald-500" : "bg-rose-500"}`} />
                                            <span className={`text-[9px] font-black tracking-widest uppercase italic ${isRunning ? "text-orange-400" : isWin ? "text-emerald-500" : "text-rose-500"}`}>
                                                {isRunning ? "Real-time" : isWin ? "Secured" : "Settled"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                        </motion.div>
                    );
                })}
        </motion.div>
    );
};

export default BetCards;
