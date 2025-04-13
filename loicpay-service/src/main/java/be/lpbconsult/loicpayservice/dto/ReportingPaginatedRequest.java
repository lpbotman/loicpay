package be.lpbconsult.loicpayservice.dto;

import lombok.Getter;

import java.util.Map;

@Getter
public class ReportingPaginatedRequest {
    private Map<String, Object> params;
    private Integer page;
    private Integer size;
    private String query;
    private boolean includeIgnored;
}
