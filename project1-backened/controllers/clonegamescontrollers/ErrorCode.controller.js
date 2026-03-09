// Success
return res.status(200).json({
    status: 0,
    success: true,
    message: "Success",
  });
  
  // On maintenance
  return res.status(503).json({
    status: 1,
    success: false,
    message: "On maintenance",
  });
  
  // Internal server error
  return res.status(500).json({
    status: 1001,
    success: false,
    message: "Internal server error",
  });
  
  // Request data format error
  return res.status(400).json({
    status: 1002,
    success: false,
    message: "Request data format error",
  });
  
  // Service exception occurred
  return res.status(500).json({
    status: 1003,
    success: false,
    message: "Service exception occurred",
  });
  
  // Authentication token not found
  return res.status(401).json({
    status: 1007,
    success: false,
    message: "Authentication token not found",
  });
  
  // Authentication token invalid
  return res.status(401).json({
    status: 1009,
    success: false,
    message: "Authentication token invalid",
  });
  
  // No access
  return res.status(403).json({
    status: 1010,
    success: false,
    message: "No access",
  });
  
  // Provider error
  return res.status(500).json({
    status: 1011,
    success: false,
    message: "Provider error",
  });
  
  // Parameters invalid
  return res.status(400).json({
    status: 1012,
    success: false,
    message: "Parameters invalid",
  });
  
  // Callback error
  return res.status(500).json({
    status: 1015,
    success: false,
    message: "Callback error (Callback API error log needs to be checked)",
  });
  
  // Server load error (concurrent call limit exceeded)
  return res.status(429).json({
    status: 1018,
    success: false,
    message: "Server load error (concurrent call limit exceeded)",
  });
  
  // Not allowed IP
  return res.status(403).json({
    status: 1020,
    success: false,
    message: "Not allowed IP",
  });
  
  // Agent information not found
  return res.status(404).json({
    status: 2001,
    success: false,
    message: "Agent information not found",
  });
  
  // User information not found
  return res.status(404).json({
    status: 2002,
    success: false,
    message: "User information not found",
  });
  
  // Game information not found
  return res.status(404).json({
    status: 2003,
    success: false,
    message: "Game information not found",
  });
  
  // Insufficient agent point balance
  return res.status(400).json({
    status: 2005,
    success: false,
    message: "Insufficient agent point balance",
  });
  
  // Insufficient user point balance
  return res.status(400).json({
    status: 2006,
    success: false,
    message: "Insufficient user point balance",
  });
  
  // Provider information not found
  return res.status(404).json({
    status: 2007,
    success: false,
    message: "Provider information not found",
  });
  
  // Already bonus call is running
  return res.status(400).json({
    status: 2011,
    success: false,
    message: "Already bonus call is running",
  });
  
  // Already bonus call is ended
  return res.status(400).json({
    status: 2012,
    success: false,
    message: "Already bonus call is ended",
  });
  
  // Round information not found
  return res.status(404).json({
    status: 2013,
    success: false,
    message: "Round information not found",
  });
  
  // Currency is not supported
  return res.status(400).json({
    status: 2014,
    success: false,
    message: "Currency is not supported",
  });
  