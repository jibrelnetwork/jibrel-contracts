#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

if [ "$SOLIDITY_COVERAGE" = true ]; then
  ganache_port=8545
else
  ganache_port=8560
fi

write_keys_to_file() {
  keys=(${!1})
  keys_file_path=./.jsapi.json

  echo -en "{\n\t\"privateKeys\": [" > $keys_file_path

  for i in {0..9}
  do
    echo -en "\"${keys[i]}\"" >> $keys_file_path

    if [ $i -lt 9 ]; then
      echo -en ", " >> $keys_file_path
    else
      echo -en "]," >> $keys_file_path
    fi
  done
}

ganache_running() {
  nc -z localhost "$ganache_port"
}

start_ganache() {
  # We define 20 accounts with balance 1M ether, needed for high-value tests.
  for i in {0..40}
  do
    keys[i]=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  done

  local accounts=(
    --account="0x${keys[0]},1000000000000000000000000"  \
    --account="0x${keys[1]},1000000000000000000000000"  \
    --account="0x${keys[2]},1000000000000000000000000"  \
    --account="0x${keys[3]},1000000000000000000000000"  \
    --account="0x${keys[4]},1000000000000000000000000"  \
    --account="0x${keys[5]},1000000000000000000000000"  \
    --account="0x${keys[6]},1000000000000000000000000"  \
    --account="0x${keys[7]},1000000000000000000000000"  \
    --account="0x${keys[8]},1000000000000000000000000"  \
    --account="0x${keys[9]},1000000000000000000000000"  \
    --account="0x${keys[10]},1000000000000000000000000"  \
    --account="0x${keys[11]},1000000000000000000000000"  \
    --account="0x${keys[12]},1000000000000000000000000"  \
    --account="0x${keys[13]},1000000000000000000000000"  \
    --account="0x${keys[14]},1000000000000000000000000"  \
    --account="0x${keys[15]},1000000000000000000000000"  \
    --account="0x${keys[16]},1000000000000000000000000"  \
    --account="0x${keys[17]},1000000000000000000000000"  \
    --account="0x${keys[18]},1000000000000000000000000"  \
    --account="0x${keys[19]},1000000000000000000000000"  \
    --account="0x${keys[20]},1000000000000000000000000"  \
    --account="0x${keys[21]},1000000000000000000000000"  \
    --account="0x${keys[22]},1000000000000000000000000"  \
    --account="0x${keys[23]},1000000000000000000000000"  \
    --account="0x${keys[24]},1000000000000000000000000"  \
    --account="0x${keys[25]},1000000000000000000000000"  \
    --account="0x${keys[26]},1000000000000000000000000"  \
    --account="0x${keys[27]},1000000000000000000000000"  \
    --account="0x${keys[28]},1000000000000000000000000"  \
    --account="0x${keys[29]},1000000000000000000000000"  \
    --account="0x${keys[30]},1000000000000000000000000"  \
    --account="0x${keys[31]},1000000000000000000000000"  \
    --account="0x${keys[32]},1000000000000000000000000"  \
    --account="0x${keys[33]},1000000000000000000000000"  \
    --account="0x${keys[34]},1000000000000000000000000"  \
    --account="0x${keys[35]},1000000000000000000000000"  \
    --account="0x${keys[36]},1000000000000000000000000"  \
    --account="0x${keys[37]},1000000000000000000000000"  \
    --account="0x${keys[38]},1000000000000000000000000"  \
    --account="0x${keys[39]},1000000000000000000000000"  \
  )

  if [ "$SOLIDITY_COVERAGE" = true ]; then
    node_modules/.bin/testrpc-sc --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
  else
    node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
  fi

  ganache_pid=$!

  write_keys_to_file keys[@]
}

if ganache_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  start_ganache
fi

if [ "$SOLC_NIGHTLY" = true ]; then
  echo "Downloading solc nightly"
  wget -q https://raw.githubusercontent.com/ethereum/solc-bin/gh-pages/bin/soljson-nightly.js -O /tmp/soljson.js && find . -name soljson.js -exec cp /tmp/soljson.js {} \;
fi

if [ "$SOLIDITY_COVERAGE" = true ]; then
  node_modules/.bin/solidity-coverage

  if [ "$CONTINUOUS_INTEGRATION" = true ]; then
    cat coverage/lcov.info | node_modules/.bin/coveralls
  fi
else
  node_modules/.bin/truffle test "$@"
fi
