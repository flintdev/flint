#!/usr/bin/env bash

if [[ $# -ne 1 ]]; then
  echo "Incorrect usage!"
  echo "Usage: $0 <check|install|start|upgrade> "
  exit 1
fi

opt=$1
workflowEngineInstallerEP="https://raw.githubusercontent.com/flintdev/installer/master/pythonExecutor.sh"

case $opt in
    "check")
      curl -s -S -L $workflowEngineInstallerEP | bash -s check
    ;;
    "install")
      curl -s -S -L $workflowEngineInstallerEP | bash -s install
    ;;
    "start")
      curl -s -S -L $workflowEngineInstallerEP | bash -s start
    ;;
    "upgrade")
      curl -s -S -L $workflowEngineInstallerEP | bash -s upgrade
    ;;
    *)
      echo "Incorrect usage!"
      echo "Usage: $0 <check|install|start|upgrade> "
      exit 1
    ;;
esac