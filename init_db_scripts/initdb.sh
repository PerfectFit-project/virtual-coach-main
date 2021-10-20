#!/bin/bash
dump_fname=/docker-entrypoint-initdb.d/test.sql
echo "Restoring db state from: ${dump_fname} ..."
pg_restore -c -d perfectfit -U root < ${dump_fname} || { echo "Error occured when trying to restore db from dump: ${dump_fname}" ; exit 1 ; }
echo "...done"
