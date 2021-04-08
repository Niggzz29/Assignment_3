import axios from "axios";
import { Row, Col, Space, Table, Card, Input, Select } from "antd";
import { useEffect, useState } from "react";
import './App.css';

const { Option } = Select;

const columns = [
      {
        title: '',
        dataIndex: 'currencyName',
      },
      {
        title: 'WE BUY',
        dataIndex: 'buy',
      },
      {
        title: 'EXCHANGE RATE',
        dataIndex: 'exchange',
      },
      {
        title: 'WE SELL',
        dataIndex: 'sell',
      },
    ];

const TableApp = () => {
  const [dataSource, setDataSource] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [inputCurrency, setInputCurrency] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
 

  const calculateValue = (value, type) => {
    switch (type) {
      case "buy":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      case "exchange":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      case "sell":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      default:
        return "-";
    }
  };

  const processData = (data) => {
    const rates = data?.rates;
    const tempDataSource = [];
    let index = 0;

    if (!inputCurrency) {
      console.log("inputCurrency", data);
      for (const property in rates) {
        tempDataSource.push({
          key: index++,
          currencyName: property,
          buy: "-",
          exchange: "-",
          sell: "-",
        });
      }
      return tempDataSource;
    }
      console.log("fwjfw");
      for (const property in rates) {
        let value = rates[property];
        tempDataSource.push({
          key: index++,
          currencyName: property,
          buy: calculateValue(value, 'buy'),
          exchange: calculateValue(value, 'exchange'),
          sell: calculateValue(value, 'sell'),
      });
    }
    console.log("wfwf", dataSource);
    return tempDataSource;
  };

  useEffect(() => {
    (async () => {
      const result = await axios.get("https://api.exchangeratesapi.io/latest");
      if (result.status !== 200) {
        return;
      }
      const data = result?.data;
      
      if (data) {
        setRawData(data);
      }
    })();
  }, []);

/**
 * Similar
 * componenentDidUpdate / ComponentReceiveProps 
 */ 
  useEffect(() => {
    if (!rawData) {
      return;
    }
    setDataSource(processData(rawData));
  }, [rawData, inputCurrency, selectedCurrency]);

  const onChangeInput = (e) => {
    setInputCurrency(e.target.value);
  };

  // const formatNumber = (value) => {
  //   const removedSeparator = value.replace(/,/g, "");
    
  //   if (!value) {
  //     return '';
  //   }
  //   if (!RegExp(/^[0-9]*$/).test(removedSeparator)) {
  //     return removedSeparator.subString(0, removedSeparator.length - 1);
  //   } 
  //   return removedSeparator;
  // };

  // const rupiahFormat = (value) => {
  //   if (!value) {
  //     return 0;
  //   }
  //   return new Intl.NumberFormat({
  //     style: "currency",
  //   }).format(value);
  // };

  const onChangeSelect = (val) => {
    const selectData = rawData.rates[val];
    setSelectedCurrency(selectData);
  };

  const SelectionCurrency = () => {
    return (
      <Select placeholder="Select Currency" onChange={onChangeSelect}>
      {dataSource && dataSource.map((v) => {
         return <Option value={v.currencyName}>{v.currencyName}</Option>
        })}
     </Select>
    );
  };
  
  return (
    <Row>
      <Col lg={{ span: 12, offset: 3 }}>
        <Space direction="vertical">
          <Card title="Currency List" style={{ width: 950, backgroundColor: "#ffe7ba" }}>
            <Input
              disabled={selectedCurrency === ""}
              placeholder="Please select currency" 
              addonBefore={SelectionCurrency()} 
              value={inputCurrency}
              onChange={onChangeInput}
            />
            <h4>Today's Rate: {selectedCurrency}</h4>
           
           <Table dataSource={dataSource} columns={columns} />

          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TableApp;
