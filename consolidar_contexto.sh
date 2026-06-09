#!/bin/bash

# Nombre del archivo de salida
OUTPUT_FILE="contexto_proyecto_artemis.txt"

# Limpiar archivo de salida si ya existe
> "$OUTPUT_FILE"

echo "==================================================" >> "$OUTPUT_FILE"
echo "ESTRUCTURA GENERAL DEL PROYECTO" >> "$OUTPUT_FILE"
echo "==================================================" >> "$OUTPUT_FILE"

echo "[*] Generando mapa de estructura..."
# Genera un árbol conceptual del proyecto ignorando directorios pesados o binarios
find . -maxdepth 5 \
    -not -path '*/.*' \
    -not -path '*node_modules*' \
    -not -path '*bin*' \
    -not -path '*obj*' \
    -not -path '*dist*' \
    -not -path '*.next*' \
    -not -path '*packages*' \
    | sed -e 's/[^-][^\/]*\// |/g' -e 's/|\([^ ]\)/|-- \1/' >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"

echo "[*] Procesando y concatenando archivos de código..."

# Extensiones de archivos que queremos incluir en el contexto
# Añade o remueve según las necesidades de Artemis
EXTENSIONS=(-name "*.cs" -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" -o -name "*.csproj" -o -name "*.sln")

# Buscar y procesar archivos recursivamente
find . -type f \( "${EXTENSIONS[@]}" \) \
    -not -path '*/.*' \
    -not -path '*node_modules*' \
    -not -path '*bin*' \
    -not -path '*obj*' \
    -not -path '*dist*' \
    -not -path '*.next*' \
    -not -path '*packages*' \
    -not -path "*$OUTPUT_FILE*" | while read -r file; do

    # Separador claro con la ruta relativa del archivo para que la IA entienda el contexto modular
    echo "==================================================RUTA: $file" >> "$OUTPUT_FILE"
    
    # Opción de compresión básica: remueve líneas completamente vacías repetidas para ahorrar tokens
    # sin alterar la indentación sintáctica esencial para C# o JS.
    cat "$file" | tr -s '\n' >> "$OUTPUT_FILE"
    
    echo "" >> "$OUTPUT_FILE" # Asegurar salto de línea al final del archivo
done

echo "==================================================" >> "$OUTPUT_FILE"
echo "FIN DEL CONTEXTO DE CÓDIGO" >> "$OUTPUT_FILE"
echo "==================================================" >> "$OUTPUT_FILE"

# Estadísticas finales
TOTAL_LINES=$(wc -l < "$OUTPUT_FILE")
echo "[+] Proceso completado con éxito."
echo "[+] Archivo generado: $OUTPUT_FILE"
echo "[+] Total de líneas de contexto: $TOTAL_LINES"