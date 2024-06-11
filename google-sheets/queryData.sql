-- Selects the KPIs for campaigns where campaign is not experiment and is active
=QUERY('MTD Src'!A2:G, 
    "SELECT C, G, E, D
    WHERE F != TRUE AND 
    B = TRUE"
    )