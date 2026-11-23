#!/bin/bash
# =============================================================
# pruebas.sh · Pruebas de rechazo R1-R7 (DTD frente a XSD)
# Crea en pruebas/ una copia de cada catálogo por prueba,
# aplica el cambio al producto BR-0202 y valida cada copia.
# Uso (en la carpeta catalogo):  bash pruebas.sh
# =============================================================
mkdir -p pruebas

# Cada prueba: nombre y orden de sed que aplica el cambio
declare -A CAMBIO=(
  [R1]='s#<precio moneda="EUR">29.95</precio>#<precio moneda="EUR">gratis</precio>#'
  [R2]='s#ref="BR-0202"#ref="BR-0201"#'
  [R3]='/ref="BR-0202"/s#categoria="accesorio"#categoria="ropa"#'
  [R4]='/<stock>18<\/stock>/d'
  [R5]='s#ref="BR-0202"#ref="X-2"#'
  [R6]='s#<stock>18</stock>#<stock>-3</stock>#'
  [R7]='/<nombre>Candado U Pro<\/nombre>/{h;d};/<precio moneda="EUR">29.95<\/precio>/{G}'
)
declare -A DESC=(
  [R1]='Precio «gratis»'           [R2]='ref igual a otra (BR-0201)'
  [R3]='Categoría «ropa»'          [R4]='Sin elemento stock'
  [R5]='ref="X-2"'                 [R6]='Stock -3'
  [R7]='precio antes que nombre'
)

for r in R1 R2 R3 R4 R5 R6 R7; do
  # Copia para la DTD (la DTD está en la carpeta de arriba)
  sed -e "${CAMBIO[$r]}" -e 's#SYSTEM "catalogo.dtd"#SYSTEM "../catalogo.dtd"#' \
      catalogo.xml > "pruebas/$r-dtd.xml"
  # Copia para el XSD
  sed -e "${CAMBIO[$r]}" -e 's#"catalogo.xsd"#"../catalogo.xsd"#' \
      catalogo-xsd.xml > "pruebas/$r-xsd.xml"

  echo "=================================================="
  echo "$r · ${DESC[$r]}"
  echo "---------- DTD ----------"
  if xmllint --noout --valid "pruebas/$r-dtd.xml" 2>&1; then echo ">> DTD: ACEPTADO (no lo detecta)"; else echo ">> DTD: RECHAZADO"; fi
  echo "---------- XSD ----------"
  if xmllint --noout --schema catalogo.xsd "pruebas/$r-xsd.xml" 2>&1; then echo ">> XSD: ACEPTADO (no lo detecta)"; else echo ">> XSD: RECHAZADO"; fi
done
