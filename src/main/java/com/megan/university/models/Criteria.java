package com.megan.university.models;

public class Criteria {

    private String key;
    private String value;

    public Criteria(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public Criteria() {}

    public String getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
