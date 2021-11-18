import pytest

from movici_viewer.model.model import snake_case


@pytest.mark.parametrize(
    "text, expected",
    [
        ("snake_case", "snake_case"),
        ("Words by Spaces", "words_by_spaces"),
        ("with_digits_0", "with_digits_0"),
        ("With Digits 0", "with_digits_0"),
        ("__leading_underscores", "leading_underscores"),
        ("trailing_underscores__", "trailing_underscores"),
        ("Invalid&*Characters", "invalid_characters"),
        ("Invalid&*_Characters", "invalid_characters"),
        ("^&$@*()💩Invalid Characters", "invalid_characters"),
    ],
)
def test_snake_case(text, expected):
    assert snake_case(text) == expected
