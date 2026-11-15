package com.realestate.portal.model;

import com.realestate.portal.proxy.RealProperty;

/**
 * Entita' Property per mapping e serializzazione diretta JSON.
 * Eredita da RealProperty per compatibilita' totale con il pattern Proxy.
 */
public class Property extends RealProperty {
    public Property() {
        super();
    }
}
