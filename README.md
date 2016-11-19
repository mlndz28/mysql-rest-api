Guia de uso 
============

Los pedidos tienen codificación x-www-formurlencoded, y todos son tipo POST.
las rutas son \<nombre de base de datos\>:

/add
-----

Se deben especificar los valores que se deseen insertar para un registro nuevo.

/get
-----

Se especifican los valores para los filtros del query (WHERE), estos valores deben venir con la etiqueta igual al nombre de columna.
En caso de que no se especifiquen valores se retorna toda la tabla.

/update
-----

Se deben especificar los valores para los filtros del query (WHERE), las etiquetas para filtrar el UPDATE deben tener el formato f_nombreDeColumna.
Los valores que se quieren actualizar vienen sin f_ como prefijo.

/delete
-----

Se deben especificar los valores para los filtros del query (WHERE), las etiquetas para filtrar el DELETE deben de ser los nombres de las columnas.

Generación de servicios
=======================

~~~bash
	node generator/crud.js
~~~
 :v
 
 Generación de documentación
=======================

~~~bash
	./docs.sh
~~~

Está en la carpeta docs :A
