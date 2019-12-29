#!/bin/bash
PID=/tmp/gunicorn.pid
cat $PID | xargs kill
if [ -f $PID ]
then
	rm $PID
fi
