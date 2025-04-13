package be.lpbconsult.loicpayservice.utils;

import be.lpbconsult.loicpayservice.dto.CitizenReportingResponse;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.*;
import java.util.stream.Collectors;

public class CsvUtils {

    final private static String SEPARATOR = ";";


    public static void writeReportingsToCsv(List<CitizenReportingResponse> reportings, OutputStream outputStream) throws IOException {
        // 1. Détecter tous les labels dynamiques
        Set<String> dynamicLabels = new LinkedHashSet<>();
        for (CitizenReportingResponse reporting : reportings) {
            for (CitizenReportingResponse.LabelledValue lv : reporting.getData()) {
                dynamicLabels.add(lv.getKey());
            }
        }

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream))) {
            // 2. Écrire l'en-tête
            List<String> headers = new ArrayList<>();
            headers.add("ssin");
            headers.add("ref_month");
            headers.add("is_ignored");
            headers.add("label");
            headers.addAll(dynamicLabels);
            writer.write(String.join(SEPARATOR, headers));
            writer.newLine();

            // 3. Écrire les lignes
            for (CitizenReportingResponse reporting : reportings) {
                Map<String, String> dataMap = reporting.getData().stream()
                        .collect(Collectors.toMap(
                                CitizenReportingResponse.LabelledValue::getKey,
                                lv -> lv.getValue() != null ? lv.getValue() : "",
                                (v1, v2) -> v1, // si doublon, on garde le premier
                                LinkedHashMap::new
                        ));

                List<String> row = new ArrayList<>();
                row.add(reporting.getSsin());
                row.add(String.valueOf(reporting.getRefMonth()));
                row.add(String.valueOf(reporting.isIgnored()));
                row.add(reporting.getLabels() != null ? escapeCsv(reporting.getLabels()) : "");

                for (String label : dynamicLabels) {
                    row.add(escapeCsv(dataMap.getOrDefault(label, "")));
                }

                writer.write(String.join(SEPARATOR, row));
                writer.newLine();
            }
        }
    }

    private static String escapeCsv(String value) {
        if (value.contains(SEPARATOR) || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }

}
