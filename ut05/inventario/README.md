# Inventario de equipos de red · Aula 2.05 (ASIR 1)

Ejercicio de la UT 5 de Lenguajes de marcas: el inventario de los equipos de red del aula en XML, validado con XML Schema, y los mismos datos en JSON.

| Fichero | Contenido |
|---|---|
| `inventario.xml` | Seis equipos (router, switch, punto de acceso, dos servidores e impresora) con IP, MAC, ubicación y fecha de compra |
| `inventario.xsd` | Esquema: `xs:pattern` para la IP, la MAC, el id y la red; `xs:date` para las fechas; enumeraciones de tipo y estado; `xs:unique` para id, IP y MAC |
| `inventario.json` | Los mismos datos en JSON |
| `pruebas_inventario.sh` | Cuatro pruebas de rechazo (IP fuera de rango, MAC con guiones, IP repetida, fecha inexistente) |

## Validación

```bash
xmllint --noout --schema inventario.xsd inventario.xml
bash pruebas_inventario.sh
```

## XML frente a JSON

| Aspecto | XML | JSON |
|---|---|---|
| Tamaño (formateado / minificado) | 2480 / 2167 bytes | 2339 / 1628 bytes |
| Validación | XSD: comprueba que la IP y la MAC tienen formato correcto, que la fecha existe y que no hay IP ni MAC repetidas | Haría falta un JSON Schema aparte |
| Tipos | Todo es texto; los tipos los pone el XSD | Números, textos y booleanos nativos |
| Lectura desde scripts | Necesita un analizador XML | `JSON.parse`, `jq`, `json.load` en Python… |

**Para exportar el inventario a una herramienta de monitorización** usaría **JSON**: es el formato de las APIs de Zabbix, Grafana, NetBox o Prometheus (service discovery con `file_sd`), se procesa fácilmente con `jq` o Python y ocupa menos. El XML con su XSD lo reservaría como **formato de archivo validado**: para guardar el inventario oficial del aula o intercambiarlo con otro departamento, donde importa que nadie meta una IP mal escrita o duplicada.
