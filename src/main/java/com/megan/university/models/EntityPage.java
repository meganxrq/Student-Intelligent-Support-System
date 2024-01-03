package com.megan.university.models;

import java.util.List;

public class EntityPage<T> {

    private List<T> entityList;
    private long totalEntityCount;

    public EntityPage(List<T> entityList, long totalEntityCount) {
        this.entityList = entityList;
        this.totalEntityCount = totalEntityCount;
    }

    public List<T> getEntityList() {
        return entityList;
    }

    public long getTotalEntityCount() {
        return totalEntityCount;
    }

}
