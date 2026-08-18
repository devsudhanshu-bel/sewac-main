/* ============================================================
   INITIAL CITY FIT
============================================================ */

function InitialCityFit({
  cityBoundary,
  zones,
}) {
  const map =
    useMap();

  const hasFitted =
    useRef(false);

  useEffect(() => {

    if (
      hasFitted.current
    ) {
      return;
    }


    /*
     * ----------------------------------------------------------
     * HELPER
     * ----------------------------------------------------------
     *
     * Fits the supplied bounds and then makes the resulting
     * city-level zoom the minimum zoom of the map.
     *
     * This means:
     *
     *     zoom in  -> unlimited up to maxZoom
     *
     *     zoom out -> allowed normally
     *
     *     city view -> STOP
     *
     * We do NOT hard-code minZoom = 10/11 because the correct
     * city zoom depends on the actual map container size.
     * ----------------------------------------------------------
     */

    const fitCityBounds = (
      bounds
    ) => {

      if (
        !bounds ||
        !bounds.isValid()
      ) {
        return false;
      }


      /*
       * Make sure Leaflet knows the current container size
       * before calculating the correct zoom.
       */

      map.invalidateSize();


      /*
       * Same padding used by the existing city fit.
       */

      const padding =
        L.point(
          40,
          40
        );


      /*
       * Calculate the exact zoom required to fit the entire
       * city boundary inside the map.
       *
       * "false" means the bounds must be completely visible.
       */

      const calculatedZoom =
        map.getBoundsZoom(
          bounds,
          false,
          padding
        );


      /*
       * The existing implementation intentionally prevents
       * the initial city view from becoming excessively zoomed.
       *
       * Keep that behaviour.
       */

      const cityZoom =
        Math.min(
          calculatedZoom,
          11
        );


      /*
       * IMPORTANT:
       *
       * This is the actual fix.
       *
       * Leaflet will never allow the user to zoom below this
       * city-level zoom.
       */

      map.setMinZoom(
        cityZoom
      );


      /*
       * Fit the city exactly.
       */

      map.fitBounds(
        bounds,
        {
          padding: [
            40,
            40,
          ],

          maxZoom:
            11,

          animate:
            false,
        }
      );


      /*
       * Force the map to use the calculated city zoom.
       *
       * fitBounds can sometimes choose a slightly different
       * zoom because of the current map state.
       */

      if (
        map.getZoom() <
        cityZoom
      ) {

        map.setZoom(
          cityZoom,
          {
            animate:
              false,
          }
        );

      }


      return true;
    };


    /*
     * ----------------------------------------------------------
     * 1. PREFER ACTUAL CITY BOUNDARY
     * ----------------------------------------------------------
     */

    const cityBounds =
      getGeoJSONBounds(
        cityBoundary
      );


    if (
      cityBounds &&
      cityBounds.isValid()
    ) {

      const fitted =
        fitCityBounds(
          cityBounds
        );


      if (
        fitted
      ) {

        hasFitted.current =
          true;

        return;

      }

    }


    /*
     * ----------------------------------------------------------
     * 2. FALLBACK TO ALL ZONES
     * ----------------------------------------------------------
     *
     * Only used if the city boundary is unavailable.
     */

    const zoneBounds =
      zones
        .map(
          (
            zone
          ) =>
            getGeoJSONBounds(
              getZoneBoundary(
                zone
              )
            )
        )
        .filter(
          Boolean
        );


    if (
      !zoneBounds.length
    ) {

      return;

    }


    /*
     * Combine every zone boundary.
     */

    const combined =
      L.latLngBounds(
        zoneBounds[0]
      );


    for (
      let index = 1;
      index <
      zoneBounds.length;
      index += 1
    ) {

      combined.extend(
        zoneBounds[index]
      );

    }


    /*
     * Fit the combined zone boundary.
     */

    if (
      combined.isValid()
    ) {

      const fitted =
        fitCityBounds(
          combined
        );


      if (
        fitted
      ) {

        hasFitted.current =
          true;

      }

    }

  }, [
    map,
    cityBoundary,
    zones,
  ]);


  return null;
}