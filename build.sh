#!/bin/sh
#STC_PATH="/home/q/php/STC"
STC_PATH="/Users/welefen/Develop/svn/STC/src"
path=`dirname $0`;
first=${path:0:1};
if [[ $first != '/' ]];then
    path=$(pwd);
fi

if [ -d ${path}"/output" ];then
	rm -rf ${path}"/output";
fi
mkdir ${path}"/output";
if [ ! -f ${path}"/config.php" ];then
	cp $STC_PATH/config/config.php ${path};
fi
#path=$(pwd);
/usr/local/bin/php $STC_PATH/index.php ${path} cloudweb $1;
if [ -f ${path}"/stc.error.log" ]; then
    rm -rf ${path}"/stc.error.log";
    exit 1;
fi
cp -r www/index.js output/www/;
mkdir output/App/Common;
mkdir output/App/Conf;
mkdir output/App/Lib;
cp -r App/Common/* output/App/Common/;
cp -r App/Conf/* output/App/Conf/;
cp -r App/Lib/* output/App/Lib/;
scp -r output/* welefen@www.kitgram.com:/home/welefen/www/www.welefen.com/;
