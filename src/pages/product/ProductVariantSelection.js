import { useCurrency } from "context/currency-context"
import { useLanguage } from "context/language-provider"
import { useSites } from "context/sites-provider"
import { useEffect, useState } from "react"
import { useProducts } from "services/product/useProducts"
import { VariantSmallSummary } from "./VariantAccordion"

function normalizeColor(color) {
    return color.replace(/\s/g, '').toLowerCase();
}

function getAllVariantAttributes(variants, setAttribute) { 
    const attributes = []
    let sortedAtrributes = {}
    let availableSizes = []

    const sizeSortOrder = {
        'XS': 0,
        'S': 1,
        'M': 2,
        'L': 3,
        'XL': 4,
        'XXL': 5,
    }
    
    variants?.forEach((element, index) => {
        attributes.push({
            key: index,
            ...element.mixins.productVariantAttributes
        })
        
        if (!availableSizes.some(i => i.size === element.mixins.productVariantAttributes.size)) {
            availableSizes.push({
                id: index,
                size: element.mixins.productVariantAttributes.size
            })
        }
    });

    availableSizes.sort((a, b) => {
        return sizeSortOrder[a.size] - sizeSortOrder[b.size];
    });

    availableSizes = availableSizes.map(item => item.size)

    sortedAtrributes = attributes.reduce((acc, {color, size}) => {
        acc[color] ??= {color, availableSizes: []};
        if(Array.isArray(size)) 
          acc[color].availableSizes = acc[color].availableSizes.concat(size);
        else
          acc[color].availableSizes.push(size);
        
        return acc;
      }, {});    

      console.log('sortedAtrributes', sortedAtrributes)

    setAttribute({
        color: attributes[0].color,
        size: null,
        availableSizes,
        availableColors: Object.values(sortedAtrributes),
        availableSizesForColor: sortedAtrributes[Object.keys(sortedAtrributes)[0]].availableSizes
    })
}

export const ProductVariantSelection =  ({ product }) => {
    const { getVariantChildren } = useProducts()
    const { currentSite } = useSites()
    const [variants, setVariants] = useState([])

    
    const { currentLanguage } = useLanguage()

    const { activeCurrency } = useCurrency()
    const [selectedAttributes, setAttribute] = useState({
        availableSizesForColor: [],
        availableSizes: [],
        availableColors: [],
        color: null,
        size: null,
    })

    const [selectedVariant, setVariant] = useState({})

    const selectedColorVariant = (selectedAttributes, size) => {
    
        console.log('availableSizesForColor' ,selectedAttributes)
        let styling = ''
        const availableSize = selectedAttributes.availableColors.filter((item) => selectedAttributes.color === item.color)[0].availableSizes

        if(availableSize.includes(size)) {
            styling = 'product-variant-selection-color'
        } else {
            styling = 'product-variant-selection-color productVariantSelectionColor_notAvailable'
        }

        if( selectedAttributes.size === size) {
            styling = styling + ' productVariantSelectionColor_selected'
        }
        return styling
    }

    useEffect(() => {
        ;(async () => {
            const allVariants = await getVariantChildren(product.id)

          if (allVariants !== undefined && variants.length <= 0) {

            setVariants(allVariants)
            getAllVariantAttributes(allVariants, setAttribute)
          }

          if (selectedAttributes.color && selectedAttributes.size) {
            const selected = variants.filter(variant => variant.mixins.productVariantAttributes.color === selectedAttributes.color && variant.mixins.productVariantAttributes.size === selectedAttributes.size)[0];
            if (selected !== undefined) {
                setVariant(selected)
            } else if (selected === undefined && selectedVariant.id !== undefined) {
                setVariant({})
            } 
          }
        })()
      }, [product, currentSite, activeCurrency, currentLanguage, selectedAttributes, getVariantChildren, selectedVariant, variants])

    return (
        <div>
            <div className="mb-4">
                <div className="flex">
                {selectedAttributes?.availableColors ? (
                    selectedAttributes?.availableColors.map(item => {
                        return (
                            <div className={selectedAttributes.color === item.color ? 'border border-solid border-black mr-2 p-[1px]': 'p-[2px] mr-2'}>
                                <div className={"p-[1px] w-10 h-10 bg-" + normalizeColor(item.color)} onClick={() => setAttribute({
                                    ...selectedAttributes,
                                    color: item.color
                                })}></div>
                            </div>
                        )
                    })
                ): ''}
                </div>
            </div>
            
            <div className="mb-4">
                <div className="flex">
                    {selectedAttributes?.availableSizes.length ? (
                        selectedAttributes?.availableSizes.map(size => {
                            selectedColorVariant(selectedAttributes, size)
                            return (
                                <button className={selectedColorVariant(selectedAttributes, size)} onClick={() => setAttribute({
                                    ...selectedAttributes,
                                    size
                                })}>
                                    { size }
                                </button>
                            )
                        })
                    ) : ''}                 
                </div>
            </div>

            {selectedVariant?.id !== undefined ? (
               <VariantSmallSummary variant={selectedVariant}></VariantSmallSummary>
            ) : ''}
        </div>
    )
}