import { pi, deg2rad } from './constants';

import sgp4init from './propagation/sgp4init';

import { DateTime } from 'luxon';

//datetime

let _epoch0 = "1949-12-31 00:00:00"
let _to_radians = pi / 180.0
let _ndot_units = 1036800.0 / pi
let _nddot_units = 2985984000.0 / 2.0 / pi

export default function jsonFormat(fields) {
    const satrec = {};
    satrec.classification = fields['CLASSIFICATION_TYPE'];
    satrec.intldesg = fields['OBJECT_ID'];
    satrec.ephtype = fields['EPHEMERIS_TYPE'];
    satrec.elnum = fields['ELEMENT_SET_NO'];
    satrec.revnum = fields['REV_AT_EPOCH'];

    let epoch_datetime = DateTime.fromISO(fields['EPOCH']);
    satrec.epoch = epoch_datetime.diff(DateTime.fromISO(_epoch0)).as('seconds') / 86400.0;

    satrec.argpo = fields['ARG_OF_PERICENTER'] * _to_radians
    satrec.bstar = fields['BSTAR']
    satrec.ecco = fields['ECCENTRICITY']
    satrec.inclo = fields['INCLINATION'] * _to_radians
    satrec.mo = fields['MEAN_ANOMALY'] * _to_radians
    satrec.nddot = fields['MEAN_MOTION_DDOT'] / _nddot_units
    satrec.ndot = fields['MEAN_MOTION_DOT'] / _ndot_units
    satrec.no = fields['MEAN_MOTION'] / 720.0 * pi
    satrec.nodeo = fields['RA_OF_ASC_NODE'] * _to_radians
    satrec.satnum = fields['NORAD_CAT_ID']

  //  ---------------- initialize the orbit at sgp4epoch -------------------
  sgp4init(satrec, {
    opsmode,
    satn: satrec.satnum,
    epoch: satrec.epoch,
    xbstar: satrec.bstar,
    xecco: satrec.ecco,
    xargpo: satrec.argpo,
    xinclo: satrec.inclo,
    xmo: satrec.mo,
    xno: satrec.no,
    xnodeo: satrec.nodeo,
  });

  return satrec;
}
