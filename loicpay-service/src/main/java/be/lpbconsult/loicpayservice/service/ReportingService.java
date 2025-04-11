package be.lpbconsult.loicpayservice.service;

import be.lpbconsult.loicpayservice.config.QueryConfig;
import jakarta.persistence.Query;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ReportingService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private QueryConfig queryConfig;

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
}
