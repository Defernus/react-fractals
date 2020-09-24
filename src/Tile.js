import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TYPE_NONE = 0;
const TYPE_HORISONTAL = 1;
const TYPE_VERTICAL = 2;

const SquareWrapper = styled.div`
    width: 50em;
    height: 50em;
    display: flex;
    flex-direction: ${props => props.type == TYPE_HORISONTAL? "column" : "row"};
    background-color: ${props => (props.color || "#00000000")};
`;

const TitleHalfWarpper = styled.div`
    ${props => props.type == TYPE_HORISONTAL ? "width" : "height"}: 100em;
    ${props => props.type == TYPE_VERTICAL ? "width" : "height"}: 50em;
    display: flex;
    font-size: 0.5em;
    flex-direction: ${props => props.type == TYPE_VERTICAL? "column" : "row"};
    background-color: ${props => (props.color || "#00000000")};
`;

const MAX_ITTERATIONS = 200;

const getColor = (x, y) => {
    console.log(x, y);

    let n = 0

    let zx = x;
    let zy = y;

    for(n = 0; n != MAX_ITTERATIONS; ++n) {
        const nzx = zx*zx - zy*zy + x;
        zy = 2*zx*zy + y;
        zx = nzx;

        if(zx*zx+zy*zy > 4) {
            break;
        }
    }

    n /= MAX_ITTERATIONS;

    n = 1-n;
    n *= n*n;

    const r = n;
    const g = n;
    const b = n;

    return `rgb(${Math.floor(r*256)}, ${Math.floor(g*256)}, ${Math.floor(b*256)})`;
}

const TitleHalf = ({x, y, scale, type}) => {
    const [hasSubTiles, setHasSubtiles] = useState(false);
    const [color, setColor] = useState("#000");

    useEffect(() => {
        setColor(getColor(x, y));
    }, []);

    const renderSubTiles = () => {
        const x1 = type == TYPE_HORISONTAL ? x - scale : x;
        const x2 = type == TYPE_HORISONTAL ? x + scale : x;
        const y1 = type == TYPE_VERTICAL ? y + scale : y;
        const y2 = type == TYPE_VERTICAL ? y - scale : y;
    
        return (
            <>
                <Tile type={type} x={x1} y={y1} scale={scale}/>
                <Tile type={type} x={x2} y={y2} scale={scale} />
            </>
        );
    }

    return (
        <TitleHalfWarpper type={type} onMouseOver={() => setHasSubtiles(true)} color={color}>
            {hasSubTiles && renderSubTiles()}
        </TitleHalfWarpper>
    );
}

const Tile = ({x, y, scale}) => {
    const [type, setType] = useState(TYPE_NONE);
    const [color, setColor] = useState("#000");

    useEffect(() => {
        setColor(getColor(x, y));
    }, []);

    const devide = () => {setType(Math.random() > 0.5 ? TYPE_HORISONTAL : TYPE_VERTICAL)};

    const new_scale = scale/2;
    const x1 = type == TYPE_VERTICAL ? x - new_scale : x;
    const x2 = type == TYPE_VERTICAL ? x + new_scale : x;
    const y1 = type == TYPE_HORISONTAL ? y + new_scale : y;
    const y2 = type == TYPE_HORISONTAL ? y - new_scale : y;

    if(type == TYPE_NONE && Math.random() < 0.999) {
        devide();
    }

    return (
        <SquareWrapper onMouseOver={() => {type == TYPE_NONE && devide()}} color={color} type={type}>
            {type && 
                <>
                    <TitleHalf type={type} x={x1} y={y1} scale={new_scale}/>
                    <TitleHalf type={type} x={x2} y={y2} scale={new_scale}/>
                </> || null
            }
        </SquareWrapper>
    );
}

export default Tile;