/*
 * Copyright 2017 Raffa Levy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Complex = mathjs.Complex;

/**
 * Calculate Discrete Fourier Transform of array x.
 * @param {number[]} x The input array
 * @returns {number[]} X - The output array
 */
function fourier(x: number[]) : Complex[] {
    const m = math.multiply;
    const a = math.add;

    const N = x.length;

    const X : any[] = [];

    for (let k = 0; k < N; k++) {
        let Xk : any = 0;
        for (let n = 0; n < N; n++) {
            // Xk = Xk + x[n] * e^(-2pi * ikn/N) / N
            Xk = a(Xk, m(x[n] / N, math.exp(m(-2 * math.pi * k * n / N, math.i))));
        }
        X[k] = math.conj(math.round(Xk , 5));
    }

    return X;
}

/**
 * Turn a Fourier series into an equivalent function of cosine and sine waves.
 * @param {mathjs.Complex[]} x
 * @param {string} varname
 * @returns {string}
 */
function toFunctionString(x: Complex[], varname?: string) : string {
    if (!varname) varname = 'x';
    let out = '';
    x.forEach((value, index) => {
        if (math.re(value) > 0) {
            out = out + ' + ' + math.re(value) + 'cos(' + index + varname + ')'
        } else if (math.re(value) < 0) {
            out = out + ' - ' + -math.re(value) + 'cos(' + index + varname + ')'
        }
        if (math.im(value) > 0) {
            out = out + ' + ' + math.im(value) + 'sin(' + index + varname + ')'
        } else if (math.im(value) < 0) {
            out = out + ' - ' + -math.im(value) + 'sin(' + index + varname + ')'
        }
    });
    if (out.slice(0, 3) == ' + ' || out.slice(0, 3) == ' - ') {
        out = out.slice(3, out.length);
    }
    out = 'f(' + varname + ') = ' + out;
    return out;
}

const inputArea = <HTMLTextAreaElement>document.getElementById('input');
const outputArea = <HTMLTextAreaElement>document.getElementById('output');
const funcArea = <HTMLTextAreaElement>document.getElementById('func');

inputArea.addEventListener('input', ev => {
    const vals = inputArea.value.split(' ').map(str => {
        return Number.parseFloat(str);
    });
    if (!vals.some(value => isNaN(value))) {
        const out = fourier(vals);
        outputArea.value = out.toString();
        funcArea.value = toFunctionString(out, 'a');
    } else {
        outputArea.value = '';
        funcArea.value = '';
    }

});

const outputCanvas = <HTMLCanvasElement>document.getElementById('outputchart');
const ctx = outputCanvas.getContext('2d');
const outputChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            data: [12, 19, 3, 5, 2, 3]
        }]
    }
});