import { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { getRandomColor } from '../Utils';

export default function ScatterSummary({ data, labels, nameArr }) {
    const fileName = useMemo(() => nameArr.join("_"), [nameArr]);

    const headers = useMemo(() => ([
        { label: "Turn", key: "x" },
        { label: "Price", key: "y" }
    ]), []);

    const csvArr = useMemo(() => ([
        {
            data: data[0],
            headers: headers,
            filename: fileName + "_" + labels[0] + '.csv'
        },
        {
            data: data[1],
            headers: headers,
            filename: fileName + "_" + labels[1] + '.csv'
        },
        {
            data: data[2],
            headers: headers,
            filename: fileName + "_" + labels[2] + '.csv'
        }
    ]), [data, labels, headers])

    function ScatterElement({ index }) {
        return (
            <div className="col-md-4">
                <Scatter data={{
                    datasets: [{
                        label: labels[index],
                        data: data[index],
                        backgroundColor: getRandomColor(),
                    }],
                }} />
                <CSVLink {...csvArr[index]}>Download CSV</CSVLink>
            </div>
        )
    }

    return (
        <section className='row'>
            <ScatterElement index={0} />
            <ScatterElement index={1} />
            <ScatterElement index={2} />
        </section>
    );
}





