// =====================================================
// HOME CACHE
// =====================================================
//
// Redis is intentionally disabled for the Citizen Home
// module for now.
//
// The Home module directly reads from the
// Citizen Historical Database.
//
// This file is kept so the module structure remains
// compatible and Redis can be restored later without
// changing the controller/service architecture.
//
// =====================================================


class HomeCache {

  async getCalendar() {

    return null;

  }


  async setCalendar() {

    return null;

  }


  async getToday() {

    return null;

  }


  async setToday() {

    return null;

  }


  async clearCitizenHome() {

    return null;

  }

}


export default new HomeCache();