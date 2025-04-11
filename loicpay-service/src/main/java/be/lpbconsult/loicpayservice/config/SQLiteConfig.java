/*
package be.lpbconsult.loicpayservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration;
import org.springframework.data.relational.core.dialect.Dialect;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;

@Configuration
public class SQLiteConfig extends AbstractJdbcConfiguration {

    @Bean
    @Override
    public Dialect jdbcDialect(NamedParameterJdbcOperations operations) {
        return CustomSQLiteDialect.INSTANCE;
    }

}
*/