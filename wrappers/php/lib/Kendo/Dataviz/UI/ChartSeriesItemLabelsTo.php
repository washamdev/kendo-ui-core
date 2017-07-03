<?php

namespace Kendo\Dataviz\UI;

class ChartSeriesItemLabelsTo extends \Kendo\SerializableObject {
//>> Properties

    /**
    * The background color of the to labels. Accepts a valid CSS color string, including hex and rgb.
    * @param string|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function background($value) {
        return $this->setProperty('background', $value);
    }

    /**
    * The border of the to labels.
    * @param \Kendo\Dataviz\UI\ChartSeriesItemLabelsToBorder|array $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function border($value) {
        return $this->setProperty('border', $value);
    }

    /**
    * The text color of the to labels. Accepts a valid CSS color string, including hex and rgb.
    * @param string|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function color($value) {
        return $this->setProperty('color', $value);
    }

    /**
    * The font style of the to labels.
    * @param string|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function font($value) {
        return $this->setProperty('font', $value);
    }

    /**
    * The format of the to labels. Uses kendo.format.
    * @param string|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function format($value) {
        return $this->setProperty('format', $value);
    }

    /**
    * The margin of the to labels. A numeric value will set all margins.
    * @param float|\Kendo\Dataviz\UI\ChartSeriesItemLabelsToMargin|array $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function margin($value) {
        return $this->setProperty('margin', $value);
    }

    /**
    * The padding of the to labels. A numeric value will set all paddings.
    * @param float|\Kendo\Dataviz\UI\ChartSeriesItemLabelsToPadding|array $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function padding($value) {
        return $this->setProperty('padding', $value);
    }

    /**
    * The position of the to labels. "center" - the label is positioned at the point center.; "insideBase" - the label is positioned inside, near the base of the bar.; "insideEnd" - the label is positioned inside, near the end of the point. or "outsideEnd" - the label is positioned outside, near the end of the point..
    * @param string|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function position($value) {
        return $this->setProperty('position', $value);
    }

    /**
    * Sets the template option of the ChartSeriesItemLabelsTo.
    * The template which renders the chart series to label.The fields which can be used in the template are: category - the category name. Available for area, bar, column, bubble, donut, line, pie and waterfall series.; dataItem - the original data item used to construct the point. Will be null if binding to array.; percentage - the point value represented as a percentage value. Available only for donut, pie and 100% stacked charts.; series - the data series; value - the point value. Can be a number or object containing each bound field.; runningTotal - the sum of point values since the last "runningTotal" summary point. Available for waterfall series. or total - the sum of all previous series values. Available for waterfall series..
    * @param string $value The id of the element which represents the kendo template.
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function templateId($value) {
        $value = new \Kendo\Template($value);

        return $this->setProperty('template', $value);
    }

    /**
    * Sets the template option of the ChartSeriesItemLabelsTo.
    * The template which renders the chart series to label.The fields which can be used in the template are: category - the category name. Available for area, bar, column, bubble, donut, line, pie and waterfall series.; dataItem - the original data item used to construct the point. Will be null if binding to array.; percentage - the point value represented as a percentage value. Available only for donut, pie and 100% stacked charts.; series - the data series; value - the point value. Can be a number or object containing each bound field.; runningTotal - the sum of point values since the last "runningTotal" summary point. Available for waterfall series. or total - the sum of all previous series values. Available for waterfall series..
    * @param string $value The template content.
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function template($value) {
        return $this->setProperty('template', $value);
    }

    /**
    * If set to true the chart will display the series to labels. By default chart series to labels are not displayed.
    * @param boolean|\Kendo\JavaScriptFunction $value
    * @return \Kendo\Dataviz\UI\ChartSeriesItemLabelsTo
    */
    public function visible($value) {
        return $this->setProperty('visible', $value);
    }

//<< Properties
}

?>
