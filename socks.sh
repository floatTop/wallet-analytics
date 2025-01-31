#!/bin/bash

# 检查依赖
echo "检查依赖..."
if ! command -v wget &> /dev/null; then
    echo "安装 wget..."
    yum install -y wget
fi

if ! command -v unzip &> /dev/null; then
    echo "安装 unzip..."
    yum install -y unzip
fi

# 下载和安装 3proxy
echo "下载并安装 3proxy..."
if [ ! -d "/usr/local/3proxy" ]; then
    wget https://gitee.com/liqiujiang/3proxy/releases/download/0.9.4/3proxy-master.zip -O 3proxy.zip
    unzip 3proxy.zip
    cd 3proxy-master
    make -f Makefile.Linux
    mkdir -p /usr/local/3proxy
    cp src/3proxy /usr/local/3proxy/
    cd ..
    rm -rf 3proxy.zip 3proxy-master
else
    echo "3proxy 已安装，跳过下载和编译步骤。"
fi

# 创建 3proxy 配置文件
echo "配置 3proxy..."
cat > /usr/local/3proxy/3proxy.cfg <<EOF
nserver 8.8.8.8
nserver 8.8.4.4
nscache 65536
log /var/log/3proxy.log
logformat "L%d-%m-%Y %H:%M:%S %U %C:%h %n %T"
auth strong
users user10:CL:1234
socks -p43277 -i203.6.238.103
EOF

# 创建日志目录
mkdir -p /var/log
touch /var/log/3proxy.log
chmod 666 /var/log/3proxy.log

# 启动 3proxy
echo "启动 3proxy..."
/usr/local/3proxy/3proxy /usr/local/3proxy/3proxy.cfg &

# 显示状态
echo "3proxy 已启动，监听以下地址和端口："
echo "203.6.238.103:43277 (用户: user10, 密码: 1234)"
echo "203.6.238.102:43277 (用户: user9, 密码: 1234)"
