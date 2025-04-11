package be.lpbconsult.loicpayservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Properties;

@Component
public class QueryConfig {

    private final Properties queries = new Properties();

    public QueryConfig(@Value("classpath:queries/queries.properties") Resource resource) throws IOException {
        queries.load(resource.getInputStream());
    }

    public String getQuery(String queryName) {
        return queries.getProperty(queryName);
    }
}
