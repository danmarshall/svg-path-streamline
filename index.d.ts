export interface options {
    bezierAccuracy?: number;
    tagName?: 'path' | 'polygon' | 'polyline';
}
export default function streamline(svgData: string, filletRadius: number | number[], opts?: options): string;
