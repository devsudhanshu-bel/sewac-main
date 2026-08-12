const vehicleQueues = new Map();
const activeProcessors = new Map();

class VehicleProcessorManager {
  constructor(processPacket) {
    this.processPacket = processPacket;
  }

  enqueue(vehicleId, packetHandler) {
    const key = String(vehicleId);

    if (!vehicleQueues.has(key)) {
      vehicleQueues.set(key, []);
    }

    vehicleQueues.get(key).push(packetHandler);

    this.startProcessor(key);
  }

  startProcessor(vehicleId) {
    if (activeProcessors.has(vehicleId)) {
      return;
    }

    activeProcessors.set(vehicleId, true);

    this.processVehicleQueue(vehicleId)
      .catch((err) => {
        console.error(`Vehicle processor error [${vehicleId}]:`, err);
      })
      .finally(() => {
        activeProcessors.delete(vehicleId);

        const queue = vehicleQueues.get(vehicleId);

        if (queue && queue.length > 0) {
          this.startProcessor(vehicleId);
        } else {
          vehicleQueues.delete(vehicleId);
        }
      });
  }

  async processVehicleQueue(vehicleId) {
    const queue = vehicleQueues.get(vehicleId);

    while (queue && queue.length > 0) {
      const packetHandler = queue.shift();

      try {
        await packetHandler();
      } catch (err) {
        console.error(
          `Packet processing failed for vehicle ${vehicleId}:`,
          err,
        );
      }
    }
  }

  getStats() {
    const stats = {};

    for (const [vehicleId, queue] of vehicleQueues.entries()) {
      stats[vehicleId] = {
        queued: queue.length,
        processing: activeProcessors.has(vehicleId),
      };
    }

    return stats;
  }
}

module.exports = VehicleProcessorManager;
