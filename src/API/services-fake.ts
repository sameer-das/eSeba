export const getAllBillers = (category: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                "code": 200,
                "status": "Success",
                "message": "Biller List Fetch Successfully. ",
                "resultDt": [
                    {
                        "blr_id": "RELI00000MUM03",
                        "blr_name": "Adani Electricity Mumbai Limited"
                    },
                    {
                        "blr_id": "AVVNL0000RAJ01",
                        "blr_name": "Ajmer Vidyut Vitran Nigam Limited (AVVNL)"
                    },
                    {
                        "blr_id": "APDCL0000ASM02",
                        "blr_name": "Assam Power Distribution Company Ltd (NON-RAPDR)"
                    },
                    {
                        "blr_id": "BEST00000MUM01",
                        "blr_name": "B.E.S.T Mumbai"
                    },
                    {
                        "blr_id": "BESCOM000KAR01",
                        "blr_name": "Bangalore Electricity Supply Co. Ltd (BESCOM)"
                    },
                    {
                        "blr_id": "BESLOB000RAJ02",
                        "blr_name": "Bharatpur Electricity Services Ltd. (BESL)"
                    },
                    {
                        "blr_id": "BKESL0000RAJ02",
                        "blr_name": "Bikaner Electricity Supply Limited (BkESL)"
                    },
                    {
                        "blr_id": "BSESRAJPLDEL01",
                        "blr_name": "BSES Rajdhani Power Limited"
                    },
                    {
                        "blr_id": "BSES00000DEL6I",
                        "blr_name": "BSES Rajdhani Prepaid Meter Recharge"
                    },
                    {
                        "blr_id": "BSESYAMPLDEL01",
                        "blr_name": "BSES Yamuna Power Limited"
                    },
                    {
                        "blr_id": "BSES00000DELCK",
                        "blr_name": "BSES Yamuna Prepaid Meter Recharge"
                    },
                    {
                        "blr_id": "CESC00000KOL01",
                        "blr_name": "CESC Limited"
                    },
                    {
                        "blr_id": "CESCOM000KAR01",
                        "blr_name": "Chamundeshwari Electricity Supply Corp Ltd (CESCOM)"
                    },
                    {
                        "blr_id": "CSPDCL000CHH01",
                        "blr_name": "Chhattisgarh State Power Distribution Co. Ltd"
                    },
                    {
                        "blr_id": "DADR00000NATOR",
                        "blr_name": "Dadra and Nagar Haveli and Daman and Diu Power Distribution Corporation Limited"
                    },
                    {
                        "blr_id": "DGVCL0000GUJ01",
                        "blr_name": "Dakshin Gujarat Vij Company Limited (DGVCL)"
                    },
                    {
                        "blr_id": "DHBVN0000HAR01",
                        "blr_name": "Dakshin Haryana Bijli Vitran Nigam (DHBVN)"
                    },
                    {
                        "blr_id": "DAKS00000NATV8",
                        "blr_name": "Dakshinanchal Vidyut Vitran Nigam Limited (DVVNL)(Postpaid and Smart Prepaid Meter Recharge)"
                    },
                    {
                        "blr_id": "DEPA00000NATES",
                        "blr_name": "Department of Power, Government of Arunachal Pradesh"
                    },
                    {
                        "blr_id": "DEPA00000ARPD5",
                        "blr_name": "Department of Power, Government of Arunachal Pradesh - Prepaid"
                    },
                    {
                        "blr_id": "DOPN00000NAG01",
                        "blr_name": "Department of Power, Nagaland"
                    },
                    {
                        "blr_id": "ELEC00000CHA3L",
                        "blr_name": "Electricity Department Chandigarh"
                    },
                    {
                        "blr_id": "GIFT00000GUJ6Z",
                        "blr_name": "Gift Power Company Limited"
                    },
                    {
                        "blr_id": "GED000000GOA01",
                        "blr_name": "Goa Electricity Department"
                    },
                    {
                        "blr_id": "GOVE00000PUDN0",
                        "blr_name": "Government of Puducherry Electricity Department"
                    },
                    {
                        "blr_id": "GESCOM000KAR01",
                        "blr_name": "Gulbarga Electricity Supply Company Limited"
                    },
                    {
                        "blr_id": "HPSEB0000HIP02",
                        "blr_name": "Himachal Pradesh State Electricity Board"
                    },
                    {
                        "blr_id": "HUKK00000NATGM",
                        "blr_name": "Hukkeri Rural Electric CoOperative Society Ltd"
                    },
                    {
                        "blr_id": "INDI00000NAT3R",
                        "blr_name": "India Power Corporation Limited (IPCL)"
                    },
                    {
                        "blr_id": "JVVNL0000RAJ01",
                        "blr_name": "Jaipur Vidyut Vitran Nigam (JVVNL)"
                    },
                    {
                        "blr_id": "JAMM00000JAKCP",
                        "blr_name": "Jammu and Kashmir Power Development Department"
                    },
                    {
                        "blr_id": "JUSC00000JAM01",
                        "blr_name": "Jamshedpur Utilities"
                    },
                    {
                        "blr_id": "JHAR00000NATZ1",
                        "blr_name": "Jharkhand Bijli Vitran Nigam Limited - Prepaid Meter Recharge"
                    },
                    {
                        "blr_id": "JBVNL0000JHA01",
                        "blr_name": "Jharkhand Bijli Vitran Nigam Limited (JBVNL)"
                    },
                    {
                        "blr_id": "JDVVNL000RAJ01",
                        "blr_name": "Jodhpur Vidyut Vitran Nigam Limited (JDVVNL)"
                    },
                    {
                        "blr_id": "KANN00000KERXX",
                        "blr_name": "Kanan Devan Hills Plantations Company Private Limited"
                    },
                    {
                        "blr_id": "KESCO0000UTP01",
                        "blr_name": "Kanpur Electricity Supply Company"
                    },
                    {
                        "blr_id": "KSEBL0000KER01",
                        "blr_name": "Kerala State Electricity Board Ltd. (KSEBL)"
                    },
                    {
                        "blr_id": "KEDLOB000RAJ02",
                        "blr_name": "Kota Electricity Distribution Limited (KEDL)"
                    },
                    {
                        "blr_id": "LAKS00000LAKP8",
                        "blr_name": "Lakshadweep Electricity Department"
                    },
                    {
                        "blr_id": "MPCZ00000MAP02",
                        "blr_name": "M.P. Madhya Kshetra Vidyut Vitaran - RURAL"
                    },
                    {
                        "blr_id": "MPCZ00000MAP01",
                        "blr_name": "M.P. Madhya Kshetra Vidyut Vitaran - URBAN"
                    },
                    {
                        "blr_id": "MPPK00000MAP01",
                        "blr_name": "M.P. Paschim Kshetra Vidyut Vitaran"
                    },
                    {
                        "blr_id": "MPEZ00000MAP02",
                        "blr_name": "M.P. Poorv Kshetra Vidyut Vitaran - RURAL"
                    },
                    {
                        "blr_id": "MGVCL0000GUJ01",
                        "blr_name": "Madhya Gujarat Vij Company Limited (MGVCL)"
                    },
                    {
                        "blr_id": "MADH00000NAT7A",
                        "blr_name": "Madhyanchal Vidyut Vitran Nigam Limited (MVVNL)(Postpaid and Smart Prepaid Meter Recharge)"
                    },
                    {
                        "blr_id": "MAHA00000MAH01",
                        "blr_name": "Maharashtra State Electricity Distbn Co Ltd"
                    },
                    {
                        "blr_id": "MESCOM000KAR01",
                        "blr_name": "Mangalore Electricity Supply Co. Ltd (MESCOM) - RAPDR"
                    },
                    {
                        "blr_id": "MANG00000KAR75",
                        "blr_name": "Mangalore Electricity Supply Company LTD (Non RAPDR)"
                    },
                    {
                        "blr_id": "MPDC00000MEG01",
                        "blr_name": "Meghalaya Power Dist Corp Ltd"
                    },
                    {
                        "blr_id": "MEPD00000NATK0",
                        "blr_name": "MePDCL Smart Prepaid Meter Recharge"
                    },
                    {
                        "blr_id": "NPCL00000NOI01",
                        "blr_name": "Noida Power"
                    },
                    {
                        "blr_id": "NBPDCL000BHI01",
                        "blr_name": "North Bihar Power Distribution Company Ltd."
                    },
                    {
                        "blr_id": "PGVCL0000GUJ01",
                        "blr_name": "Paschim Gujarat Vij Company Limited (PGVCL)"
                    },
                    {
                        "blr_id": "PASC00000NATUL",
                        "blr_name": "Paschimanchal Vidyut Vitran Nigam Limited (PVVNL)(Postpaid and Smart Prepaid Meter Recharge)"
                    },
                    {
                        "blr_id": "POWE00000NAT0K",
                        "blr_name": "Power and Electricity Department - Mizoram"
                    },
                    {
                        "blr_id": "PSPCL0000PUN01",
                        "blr_name": "Punjab State Power Corporation Ltd (PSPCL)"
                    },
                    {
                        "blr_id": "PURV00000NAT3O",
                        "blr_name": "Purvanchal Vidyut Vitran Nigam Limited(PUVVNL)(Postpaid and Smart Prepaid Meter Recharge)"
                    },
                    {
                        "blr_id": "SKPR00000SIK01",
                        "blr_name": "Sikkim Power - RURAL"
                    },
                    {
                        "blr_id": "SBPDCL000BHI01",
                        "blr_name": "South Bihar Power Distribution Company Ltd."
                    },
                    {
                        "blr_id": "TNEB00000TND01",
                        "blr_name": "Tamil Nadu Electricity Board (TNEB)"
                    },
                    {
                        "blr_id": "TATAPWR00DEL01",
                        "blr_name": "Tata Power - Delhi"
                    },
                    {
                        "blr_id": "TATAPWR00MUM01",
                        "blr_name": "Tata Power - Mumbai"
                    },
                    {
                        "blr_id": "THRI00000KER0H",
                        "blr_name": "Thrissur Corporation Electricity Department"
                    },
                    {
                        "blr_id": "TORR00000NATLX",
                        "blr_name": "Torrent Power"
                    },
                    {
                        "blr_id": "TPADL0000AJM02",
                        "blr_name": "TP Ajmer Distribution Ltd (TPADL)"
                    },
                    {
                        "blr_id": "CESU00000ODI01",
                        "blr_name": "TP Central Odisha Distribution Ltd."
                    },
                    {
                        "blr_id": "NESCO0000ODI01",
                        "blr_name": "TP Northern Odisha Distribution Limited"
                    },
                    {
                        "blr_id": "TPRE00000UTP28",
                        "blr_name": "TP Renewables Microgrid Ltd."
                    },
                    {
                        "blr_id": "TPSO00000ODIPG",
                        "blr_name": "TP Southen Odisha Distribution Ltd-Smart Prepaid Meter Recharge"
                    },
                    {
                        "blr_id": "SOUTHCO00ODI01",
                        "blr_name": "TP Southern Odisha Distribution Limited"
                    },
                    {
                        "blr_id": "WESCO0000ODI01",
                        "blr_name": "TP Western Odisha Distribution Limited"
                    },
                    {
                        "blr_id": "TSEC00000TRI01",
                        "blr_name": "Tripura Electricity Corp Ltd"
                    },
                    {
                        "blr_id": "UGVCL0000GUJ01",
                        "blr_name": "Uttar Gujarat Vij Company Limited (UGVCL)"
                    },
                    {
                        "blr_id": "UHBVN0000HAR01",
                        "blr_name": "Uttar Haryana Bijli Vitran Nigam (UHBVN)"
                    },
                    {
                        "blr_id": "UPPCL0000UTP02",
                        "blr_name": "Uttar Pradesh Power Corp Ltd (UPPCL) - RURAL"
                    },
                    {
                        "blr_id": "UTTA00000UTT7M",
                        "blr_name": "Uttarakhand Power Corporation Limited"
                    },
                    {
                        "blr_id": "VAGH00000GUJOR",
                        "blr_name": "Vaghani Energy Limited"
                    },
                    {
                        "blr_id": "WEST00000WBL75",
                        "blr_name": "West Bengal Electricity"
                    }
                ]
            })
        }, 2000)
    })
}