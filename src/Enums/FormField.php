<?php


namespace App\Enums;

enum FormField: string {
    case TEXT = "text";
    case DATE = "date";
    case CHECKBOX = "checkbox";
    case RADIO = "radio";
    case LIST = "list";
    case HIDDEN = "hidden";
    case SELECT = "select";

    public function hasDefaultValues(): bool {
        switch ($this) {
            case (self::TEXT):
                return true;
                // case (self::DATE):
                //     return true;
            case (self::HIDDEN):
                return true;
            default:
                return false;
        }
    }

    public function getFieldDefaultOptions(): array | null {
        switch ($this) {
            case (self::TEXT):
                return ["autoComplete" => "off"];
            case (self::HIDDEN):
                return ["hidden" => true];
                // case (self::DATE):
                // return ["dateFormat" => "dd-MM-yyyy"];
            default:
                return null;
        }
    }
}
