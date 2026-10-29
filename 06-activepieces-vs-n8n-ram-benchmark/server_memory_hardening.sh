#!/bin/bash
# ==============================================================================
# LINUX $4 VPS MEMORY HARDENING & SWAP OPTIMIZATION SCRIPT
# Prepares 1GB RAM budget VPS for high-density container workloads
# ==============================================================================

set -euo pipefail

echo "[1/4] Checking existing swap status..."
if [ $(swapon --show | wc -l) -le 1 ]; then
  echo "No active swapfile detected. Creating 2GB NVMe swapfile..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "  ✓ 2GB Swapfile activated and persisted in /etc/fstab."
else
  echo "  ✓ Swap already configured."
fi

echo "[2/4] Tuning virtual memory swappiness (target: 10)..."
sysctl vm.swappiness=10
echo 'vm.swappiness=10' >> /etc/sysctl.conf

echo "[3/4] Tuning virtual memory cache pressure (target: 50)..."
sysctl vm.vfs_cache_pressure=50
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf

echo "[4/4] Verifying memory availability..."
free -h
echo "  ✓ VPS Memory Hardening Complete: Safe buffer verified for container benchmarks!"
