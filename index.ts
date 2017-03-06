import * as makerjs from "makerjs";

export interface options {
    bezierAccuracy?: number;
    tagName?: 'path' | 'polygon' | 'polyline';
}
    
export default function streamline (svgData: string, filletRadius: number | number[], opts?: options): string {

    const defaultOptions: options = {
        bezierAccuracy: 0.25,
        tagName: 'path'
    };

    const o = makerjs.extendObject(defaultOptions, opts) as options;

    let closed = true;
    let input: makerjs.IModel;

    switch (o.tagName) {
        case 'polyline':
            closed = false;
        //fall through

        case 'polygon':
            //use points. 
            //Need to mirror them on y axis because they are expected to be in MakerJs coordinate space
            input = makerjs.model.mirror(new makerjs.models.ConnectTheDots(closed, svgData), false, true);
            break;

        default:
            input = makerjs.importer.fromSVGPathData(svgData, { bezierAccuracy: o.bezierAccuracy });
            break;
    }

    const isArray = Array.isArray(filletRadius);

    const result: makerjs.IModel = { models: { input: input, filletsPerChain: { models: {} } } };

    function fillet(chainToFillet: makerjs.IChain, index: number) {
        var filletResult: makerjs.IModel = { paths: {} };
        var added = 0;
        var links = chainToFillet.links;

        function tryAdd(i1: number, i2: number, radius: number) {
            var c1 = makerjs.path.clone(links[i1].walkedPath.pathContext);
            var c2 = makerjs.path.clone(links[i2].walkedPath.pathContext);
            var f = makerjs.path.fillet(links[i1].walkedPath.pathContext, links[i2].walkedPath.pathContext, radius);
            if (f) {
                console.log(c1, c2);
                filletResult.paths['fillet' + added] = f;
                added++;
            }
            return f;
        }

        function add(i1: number, i2: number) {
            if (isArray) {
                for (let i = 0; i < (filletRadius as number[]).length; i++) {
                    let f = tryAdd(i1, i2, (filletRadius as number[])[i]);
                    if (f) break;
                }
            } else {
                tryAdd(i1, i2, filletRadius as number);
            }
        }

        for (let i = 1; i < links.length; i++) {
            add(i - 1, i);
        }

        if (chainToFillet.endless) {
            add(links.length - 1, 0);
        }

        if (!added) return null;

        result.models['filletsPerChain'].models[index] = filletResult;
    }

    makerjs.model.findChains(input, function(chains: makerjs.IChain[], loose: makerjs.IWalkPath[], layer: string){
        chains.forEach(fillet);
    })

    return makerjs.exporter.toSVGPathData(result, false, [0, 0]) as string;
}

module.exports = streamline;
