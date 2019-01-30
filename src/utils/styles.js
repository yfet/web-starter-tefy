import React from 'react';
import Responsive from 'react-responsive';

export const mobile = '@media (max-width: 991px)';
export const desktop = '@media (min-width: 992px) and (max-width: 1380px)';
export const desktopLarge = '@media (min-width: 1381px)';

export const Mobile = (props) => <Responsive {...props} maxWidth={991} />;
export const Desktop = (props) => <Responsive {...props} minWidth={992} maxWidth={1380} />;
export const DesktopLarge = (props) => <Responsive {...props} minWidth={1381} />;
export const DesktopOrAbove = (props) => <Responsive {...props} minWidth={992} />;
