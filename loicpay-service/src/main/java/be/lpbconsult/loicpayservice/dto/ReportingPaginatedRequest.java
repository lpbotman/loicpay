package be.lpbconsult.loicpayservice.dto;


import java.util.Map;

public class ReportingPaginatedRequest {
    private Map<String, Object> params;
    private Integer page;
    private Integer size;
    private String query;
    private boolean includeIgnored;

    public Map<String, Object> getParams() {
        return params;
    }

    public Integer getPage() {
        return page;
    }

    public Integer getSize() {
        return size;
    }

    public String getQuery() {
        return query;
    }

    public boolean isIncludeIgnored() {
        return includeIgnored;
    }
}
