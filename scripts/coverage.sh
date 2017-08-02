#!/bin/bash

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the testrpc instance that we started (if we started one).
  if [ -n "$testrpc_pid" ]; then
    kill -9 $testrpc_pid
  fi
}

testrpc_running() {
  nc -z localhost 8570
}

if testrpc_running; then
  echo "Using existing testrpc-sc instance"
else
  echo "Starting testrpc-sc to generate coverage"
  # We define 10 accounts with balance 1M ether, needed for high-value tests.
  pk01=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk02=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk03=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk04=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk05=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk06=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk07=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk08=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk09=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  pk10=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  ./node_modules/ethereumjs-testrpc-sc/bin/testrpc --gasLimit 0xfffffffffff --port 8570 \
    --account="0x${pk01},1000000000000000000000000"  \
    --account="0x${pk02},1000000000000000000000000"  \
    --account="0x${pk03},1000000000000000000000000"  \
    --account="0x${pk04},1000000000000000000000000"  \
    --account="0x${pk05},1000000000000000000000000"  \
    --account="0x${pk06},1000000000000000000000000"  \
    --account="0x${pk07},1000000000000000000000000"  \
    --account="0x${pk08},1000000000000000000000000"  \
    --account="0x${pk09},1000000000000000000000000"  \
    --account="0x${pk10},1000000000000000000000000"  \
  > /dev/null &
  testrpc_pid=$!
fi

SOLIDITY_COVERAGE=true ./node_modules/.bin/solidity-coverage
