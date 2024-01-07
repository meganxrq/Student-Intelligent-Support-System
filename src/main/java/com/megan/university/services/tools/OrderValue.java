package com.megan.university.services.tools;

import java.util.HashMap;

public class OrderValue {

    /* Key - attribute name coming from Frontend
     * Value - corresponding column name in the Database */
    public static final HashMap<String, String> orderByParams = new HashMap<>();

    static {
        orderByParams.put("ID", "id");
        orderByParams.put("Name", "name");
        orderByParams.put("Full name", "fullName");
        orderByParams.put("Short name", "shortName");
        orderByParams.put("Type", "type");
        orderByParams.put("Degree", "degree");
        orderByParams.put("Amount ($)", "amount");
        orderByParams.put("Code", "code");
        orderByParams.put("Sex", "sex");
        orderByParams.put("First name", "firstName");
        orderByParams.put("Last name", "lastName");
        orderByParams.put("Study start year", "startYear");
        orderByParams.put("Number", "number");
        orderByParams.put("Program", "program");
        orderByParams.put("Start date", "startDate");
        orderByParams.put("End date", "endDate");
        orderByParams.put("Hour count", "hourCount");
        orderByParams.put("Topic", "topic");
        orderByParams.put("Defense status", "defenseStatus");
        orderByParams.put("Defense date", "defenseDate");
        orderByParams.put("Final score", "finalScore");
    }

}
