#!/usr/bin/python3

import sys, sqlite3, json

from contextlib import contextmanager

@contextmanager
def open_db_connection(dbName):
    dbh = sqlite3.connect(dbName)
    dbh.isolation_level=None
    try:
        yield dbh
    except sqlite3.Error as e:
        sys.stderr.write(e.args[0])
        dbh.rollback()
        raise e
    finally:    
        dbh.close()

with open_db_connection('bfx_templates.db') as conn:
    stmt = "SELECT * FROM tool_templates where name = 'comp_sam';"
    cursor = conn.cursor()
    cursor.execute(stmt)
    rows = cursor.fetchall()
    for r in rows:
        name = r[0]
        try:
            obj = json.loads(r[1])
        except ValueError as e:
            print('error restoring {0}: {1}'.format(name, e))
        print(name)
        print(json.dumps(obj, indent=4, separators=(',',': ')))
        print("\n")
