#!/bin/bash
# EdgeX startup helper script
set -e

EDGEX_HOME="/usr/local/bin/edgex"
cd "$EDGEX_HOME"

exec ./edgex "$@"
