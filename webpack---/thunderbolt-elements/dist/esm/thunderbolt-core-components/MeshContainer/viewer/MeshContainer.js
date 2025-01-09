import classNames from 'clsx';
import React from 'react';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import { TestIds } from '../constants';
const REPEATER_DELIMITER = '__';
const getTemplateId = (comp) => comp.props.id.split(REPEATER_DELIMITER)[0];
const renderRotatedComponentsWrapper = (child) => (React.createElement("div", { key: `${child.props.id}-rotated-wrapper`, "data-mesh-id": `${child.props.id}-rotated-wrapper` }, child));
const renderChildren = (props) => {
    const { wedges, rotatedComponents, childrenArray, renderRotatedComponents } = props;
    const rotatedComponentsSet = rotatedComponents.reduce((acc, rotatedComponent) => ({ ...acc, [rotatedComponent]: true }), {});
    const renderedRotatedComponents = childrenArray.map(child => rotatedComponentsSet[getTemplateId(child)]
        ? renderRotatedComponents(child)
        : child);
    const renderedWedges = wedges.map(wedge => (React.createElement("div", { key: wedge, "data-mesh-id": wedge })));
    return [...renderedRotatedComponents, ...renderedWedges];
};
const MeshContainer = (props, ref) => {
    const { id, className, wedges = [], rotatedComponents = [], children, fixedComponents = [], extraClassName = '', renderRotatedComponents = renderRotatedComponentsWrapper, } = props;
    const childrenArray = React.Children.toArray(children());
    const fixedChildren = [];
    const nonFixedChildren = [];
    childrenArray.forEach(comp => fixedComponents.includes(comp.props.id)
        ? fixedChildren.push(comp)
        : nonFixedChildren.push(comp));
    const meshChildren = renderChildren({
        childrenArray: nonFixedChildren,
        rotatedComponents,
        wedges,
        renderRotatedComponents,
    });
    return (React.createElement("div", { ...getDataAttributes(props), "data-mesh-id": `${id}inlineContent`, "data-testid": TestIds.inlineContent, className: classNames(className, extraClassName), ref: ref },
        React.createElement("div", { "data-mesh-id": `${id}inlineContent-gridContainer`, "data-testid": TestIds.content }, meshChildren),
        fixedChildren));
};
export default React.forwardRef(MeshContainer);
//# sourceMappingURL=MeshContainer.js.map