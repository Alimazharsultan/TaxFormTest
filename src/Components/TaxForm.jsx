import React, { useState, useEffect } from "react";
import './TaxForm.css'
import { AiOutlineSearch } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import { CategoriesData } from "../Utils/Categories";
function TaxForm() {

    const [categories, setCategories] = useState({})
    const [percentNumeric, setPercentNumeric] = useState('')
    const [percent, setPercent] = useState()
    const [selectedItems, setSelectedItems] = useState({});
    const [selectType, setSelectType] = useState('some');


    const categorySelect = (value) => {
        let tempSelectedItems = selectedItems;
        if (tempSelectedItems.hasOwnProperty(value)) {
            delete tempSelectedItems[value]
        } else {
            tempSelectedItems[value] = categories[value]
        }
        setSelectedItems({ ...tempSelectedItems })
    }

    const handleOptionChange = (id, value, category) => {
        let tempSelectedItems = selectedItems;

        if (tempSelectedItems.hasOwnProperty(category)) {
            const index = tempSelectedItems[category].findIndex((c) => c.id === id)
            if (index > -1) {
                tempSelectedItems[category].splice(index, 1)
                if (tempSelectedItems[category].length === 0) delete tempSelectedItems[category]
            } else {
                tempSelectedItems[category].push({ id, name: value })
            }
        } else {
            tempSelectedItems[category] = []
            tempSelectedItems[category].push({ id, name: value })
        }
        setSelectedItems({ ...tempSelectedItems })
        // setSelectedItems(value);

    };


    const percentInput = (e) => {

        setPercent(e.target.value)
    }

    const percentNumericInput = (e) => {

        if (e.target.value === '') {
            setPercentNumeric('')
        }
        else if (/^-?\d+$/.test(e.target.value)) {
            let value = parseFloat(e.target.value)
            if (value >= 0 && value <= 100) {
                setPercentNumeric(e.target.value)
            }
        }


    }



    const submit = (e) => {
        e.preventDefault();
        const applicable_items = []
        Object.keys(selectedItems).forEach((c) => {
            selectedItems[c].forEach((i) => {

                applicable_items.push(i.id)
            })
        })
        const outputObject = {
            applicable_items,
            appied_to: selectType,
            name: percent,
            rate: percentNumeric / 100
        }
        console.log(outputObject)
    }

    useEffect(() => {
        let tempCategory = { '': [] }
        CategoriesData.forEach((item) => {
            if (item.category) {

                if (tempCategory.hasOwnProperty(item.category.name)) {
                    tempCategory[item.category.name].push({ 'id': item.id, 'name': item.name })
                } else {

                    tempCategory[item.category.name] = [{ 'id': item.id, 'name': item.name }];
                }
            } else {
                tempCategory[''].push({ 'id': item.id, 'name': item.name })
            }
        })

        setCategories(tempCategory)
    }, [selectedItems])

    return (
        <div className="container">
            <div className="header">
                <div className="title">

                    <h1>Add Tax</h1>
                    <RxCross1 size={25} />
                </div>
                <div className="percentage-input">
                    <div className="non-numeric">
                        <input className="input-box" type="text" placeholder="" onChange={percentInput} value={percent} />
                    </div>
                    <div className="numeric">
                        <input className="input-box" type="text" placeholder="" onChange={percentNumericInput} value={percentNumeric} />
                        <span className="percentage">%</span>

                    </div>
                </div>
                <div className="selectType">

                    <div className={selectType === "all" ? "checkbox" : "emptyCheckbox"} onClick={() => {
                        setSelectType('all');
                        setSelectedItems(() => ({ ...categories, "": categories[""] }))
                    }}>

                        {selectType === "all" && <TiTick style={{ color: 'white' }} />}
                    </div>

                    <input id="all" type="radio" value="all" />
                    <label htmlFor="all">Apply to all items in collection</label><br />
                </div>
                <div className="selectType">

                    <div className={selectType === "some" ? "checkbox" : "emptyCheckbox"} onClick={() => {
                        setSelectType('some')
                        setSelectedItems({})
                    }} >

                        {selectType === "some" && <TiTick style={{ color: 'white' }} />}
                    </div>
                    <input type="radio" id="some" value="some" />
                    <label htmlFor="some">Apply to specific items</label><br />
                </div>
            </div>
            <hr />

            <div className="content">

                <div className="search-box">
                    <AiOutlineSearch className='search-icon' />
                    <input type="text" placeholder="Search Input" className="input-box" />
                </div>

                <div className="categories">
                    {Object.keys(categories).length > 0 && Object.keys(categories).map((category, index) =>
                        <div className="" key={index}>
                            <div className="category-box" >
                                <label>
                                    <div className={selectedItems[category]?.length > 0 ? "squareCheckboxChecked" : "squareCheckbox"} onClick={() => categorySelect(category)}>
                                        {selectedItems[category]?.length > 0 && <TiTick style={{ color: 'white' }} />}

                                    </div>
                                    <input
                                        type='radio'
                                        id='radio1'
                                        className="multiple-select"
                                        value={category}
                                        checked={selectedItems[category]?.length > 0}
                                        onChange={() => categorySelect()}
                                    />
                                    {category}
                                </label>
                            </div>
                            <div className="categories">

                                {categories[category].map((item, index2) => {
                                    return (
                                        <div className="categoryItem" key={index2}>

                                            <div className={selectedItems[category]?.findIndex((c) => c.id === item.id) > -1 ? "squareCheckboxChecked" : "squareCheckbox"} onClick={() => handleOptionChange(item.id, item.name, category)}>
                                                {selectedItems[category]?.findIndex((c) => c.id === item.id) > -1 && <TiTick style={{ color: 'white' }} />}

                                            </div>
                                            <input
                                                type="radio"
                                                id="radio2"
                                                className="multiple-select"
                                                value={item.id}
                                                checked={selectedItems[category]?.findIndex((c) => c.id === item.id) > -1}
                                                onChange={(e) => e.preventDefault()}
                                            />
                                            {item.name}
                                        </div>)
                                }
                                )}
                            </div>

                        </div>
                    )}

                </div>
            </div>
            <hr />
            <button className="apply-button" onClick={submit}>
                Apply tax to 6 item(s)
            </button>
        </div >
    )
}

export default TaxForm