package be.lpbconsult.loicpayservice.service;

import be.lpbconsult.loicpayservice.config.QueryConfig;
import be.lpbconsult.loicpayservice.dto.CitizenReportingResponse;
import be.lpbconsult.loicpayservice.entity.CitizenReporting;
import be.lpbconsult.loicpayservice.repository.CitizenReportingRepository;
import jakarta.persistence.Query;
import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReportingService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private QueryConfig queryConfig;

    @Autowired
    private CitizenReportingRepository citizenReportingRepository;

    public Object executeQuery(String queryName, Map<String, Object> params, boolean singleValue) {
        String sql = queryConfig.getQuery(queryName);
        if (sql == null) {
            throw new IllegalArgumentException("Requête inconnue: " + queryName);
        }

        Query query = entityManager.createNativeQuery(sql);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        if (singleValue) {
            return query.getSingleResult();
        } else {
            return query.getResultList();
        }
    }

    public List<CitizenReportingResponse> getCitizenReportings(String queryName, Map<String, Object> params, int offset, int limit, boolean includeIgnored) {
        String sql = queryConfig.getQuery(queryName);
        if (sql == null) {
            throw new IllegalArgumentException("Requête inconnue: " + queryName);
        }
        String sqlIncludeIgnored = " and COALESCE(r.ignored, 0) != 1";
        String sqFinal = sql + (includeIgnored ? "" : sqlIncludeIgnored) + (limit == 0 ? "" : " LIMIT ? OFFSET ?");

        Session session = entityManager.unwrap(Session.class);
        return session.doReturningWork(connection -> {
            try (PreparedStatement stmt = connection.prepareStatement(sqFinal)) {
                int i = 1;
                for (Object paramValue : params.values()) {
                    stmt.setObject(i++, paramValue);
                }

                if (limit > 0) {
                    stmt.setInt(i++, limit);
                    stmt.setInt(i, offset);
                }
                try (ResultSet rs = stmt.executeQuery()) {
                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    List<CitizenReportingResponse> results = new ArrayList<>();

                    while (rs.next()) {
                        String ssin = rs.getString("ssin");
                        int refMonth = rs.getInt("ref_month");
                        String labels = rs.getString("labels");
                        boolean ignored = rs.getBoolean("ignored");

                        List<CitizenReportingResponse.LabelledValue> data = new ArrayList<>();

                        for (int col = 1; col <= columnCount; col++) {
                            String columnName = metaData.getColumnLabel(col);

                            if (!"ssin".equalsIgnoreCase(columnName) && !"ref_month".equalsIgnoreCase(columnName) && !"labels".equalsIgnoreCase(columnName) && !"ignored".equalsIgnoreCase(columnName)) {
                                Object rawValue = rs.getObject(col);

                                String value = rawValue != null ? rawValue.toString() : "";

                                CitizenReportingResponse.LabelledValue entry = new CitizenReportingResponse.LabelledValue(columnName, value);
                                data.add(entry);
                            }
                        }

                        CitizenReportingResponse reporting = new CitizenReportingResponse(ssin, refMonth, data,ignored,labels);
                        results.add(reporting);
                    }

                    return results;
                }
            }
        });
    }



    public int countTotal(String queryName, Map<String, Object> params) {
        String baseSql = queryConfig.getQuery(queryName);
        String countSql = buildCountQuery(baseSql);

        Session session = entityManager.unwrap(Session.class);

        return session.doReturningWork(connection -> {
            try (PreparedStatement stmt = connection.prepareStatement(countSql)) {
                int i = 1;
                for (Object paramValue : params.values()) {
                    stmt.setObject(i++, paramValue);
                }
                try (ResultSet rs = stmt.executeQuery()) {
                    rs.next();
                    return rs.getInt(1);
                }
            }
        });
    }

    private String buildCountQuery(String baseSql) {
        int fromIndex = baseSql.toLowerCase().indexOf("from");
        if (fromIndex == -1) {
            throw new IllegalArgumentException("Requête invalide : mot-clé FROM manquant");
        }

        return "SELECT COUNT(*) " + baseSql.substring(fromIndex);
    }

    public void updateCitizenReporting(CitizenReporting updated) {
        Optional<CitizenReporting> existingOpt = citizenReportingRepository
                .findBySsinAndRefMonth(updated.getSsin(), updated.getRefMonth());

        if (existingOpt.isPresent()) {
            CitizenReporting existing = existingOpt.get();
            existing.setLabels(updated.getLabels());
            existing.setIgnored(updated.getIgnored());
            citizenReportingRepository.save(existing);
        } else {
            citizenReportingRepository.save(updated);
        }
    }


}
