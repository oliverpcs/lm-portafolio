#!/bin/bash
# Pruebas de rechazo del inventario: cada una cambia un dato del punto de acceso (EQ-03)
mkdir -p pruebas
declare -A C=(
  [I1]='s#<ip>192.168.10.3</ip>#<ip>192.168.10.300</ip>#'
  [I2]='s#<mac>02:1A:2B:00:00:03</mac>#<mac>02-1A-2B-00-00-03</mac>#'
  [I3]='s#<ip>192.168.10.3</ip>#<ip>192.168.10.2</ip>#'
  [I4]='s#<fechaCompra>2024-02-12#<fechaCompra>2024-02-31#'
)
declare -A D=([I1]='IP con un número mayor que 255' [I2]='MAC con guiones' [I3]='IP repetida (la del switch)' [I4]='Fecha inexistente (31 de febrero)')
for p in I1 I2 I3 I4; do
  sed -e "${C[$p]}" -e 's#"inventario.xsd"#"../inventario.xsd"#' inventario.xml > "pruebas/$p.xml"
  echo "=== $p · ${D[$p]}"
  xmllint --noout --schema inventario.xsd "pruebas/$p.xml" 2>&1 | grep -v "precomputed" || true
done
