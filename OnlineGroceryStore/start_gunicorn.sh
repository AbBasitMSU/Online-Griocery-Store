APPNAME=OnlineGroceryStore
APPDIR=/home/ubuntu/store_proj/$APPNAME

LOG_FILE=$APPDIR/'gunicorn.log'
ERROR_FILE=$APPDIR/'gunicorn-error.log'
PID=/tmp/gunicorn.pid
NUM_WORKERS=3

ADDRESS=127.0.0.1:8000

VIRTUAL_ENV=DjangoStore
cd $APPDIR
export VIRTUALENV_PYTHON=/usr/bin/python3
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh 
workon $VIRTUAL_ENV
:
if [ -f $PID ]
then	
	rm $PID
fi

exec env KEY=$(python3 keyGen.py) \
IP=$(dig +short myip.opendns.com @resolver1.opendns.com) \
gunicorn $APPNAME.wsgi:application \
-w $NUM_WORKERS --bind=$ADDRESS \
--log-level=debug \
--pid=$PID \
--log-file=$LOG_FILE \
--error-logfile=$ERROR_FILE &

