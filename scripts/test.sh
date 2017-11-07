#!/usr/bin/env bash

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the testrpc instance that we started (if we started one and if it's still running).
  if [ -n "$testrpc_pid" ] && ps -p $testrpc_pid > /dev/null; then
    kill -9 $testrpc_pid
  fi

  rm -f ./.testrpc.log
}

testrpc_running() {
  nc -z localhost 8560
}

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

if testrpc_running; then
  echo "Using existing testrpc instance"
else
  echo "Starting our own testrpc instance"

  # We define 10 accounts with balance 1M ether, needed for high-value tests.
  for i in {0..9}
  do
    keys[i]=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 64 | head -n 1)
  done

  ./node_modules/.bin/testrpc --port 8560 \
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
  > ./.testrpc.log &
  testrpc_pid=$!

  write_keys_to_file keys[@]
fi

./node_modules/.bin/truffle test "$@"
