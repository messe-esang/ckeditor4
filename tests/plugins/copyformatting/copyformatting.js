/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js*/
/* global testCopyFormattingFlow */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				allowedContent: true
			}
		}
	};

	var stylesToRemove = [
		new CKEDITOR.style( {
			element: 'b',
			attributes: {},
			styles: {},
			type: CKEDITOR.STYLE_INLINE
		} )
	 ],
	tests = {
		'test applying style on collapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			} );
		},

		'test applying style by on uncollapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 0,
				endOffset: 6
			} );
		},

		'test applying style from ambiguous initial selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy {t</s><span class="font-weight: bold">h}at</span> format</s> to <b>this element</b></p>',
			[ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 0,
				endOffset: 6
			} );
		},

		'test applying style using keystrokes': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			}, {
				from: 'keystrokeHandler'
			} );
		},

		'test removing formatting on collapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p>Copy t{}hat format to <b>this element</b></p>', [], stylesToRemove, {
				elementName: 'b',
				startOffset: 2,
				endOffset: 2,
				collapsed: true
			} );
		},

		'test removing formatting on uncollapsed selection': function( editor ) {
			testCopyFormattingFlow( editor, '<p>Copy t{}hat format to <b>this element</b></p>', [], stylesToRemove, {
				elementName: 'b',
				element: true
			} );
		},

		'test cancelling Copy Formatting command': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			// Simulating two clicks on button.
			editor.execCommand( 'copyFormatting' );
			editor.execCommand( 'copyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
		},

		'test cancelling Copy Formatting command (Escape)': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			editor.execCommand( 'copyFormatting' );

			editor.fire( 'key', {
				domEvent: {
						getKey: function() {
							return 27;
						},

						getKeystroke: function() {
							return 27;
						}
					}
			} );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
		},

		'test cancelling Copy Formatting command from keystroke (Escape)': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );
			bender.tools.selection.setWithHtml( editor, '<p><s>Co{}py that format</s>.</p>' );

			editor.execCommand( 'copyFormatting', { from: 'keystrokeHandler' } );

			editor.fire( 'key', {
				domEvent: {
						getKey: function() {
							return 27;
						},

						getKeystroke: function() {
							return 27;
						}
					}
			} );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
		},

		'test sticky Copy Formatting': function( editor ) {
			testCopyFormattingFlow( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>', [ {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			} ], stylesToRemove, {
				elementName: 'b',
				startOffset: 1,
				endOffset: 1,
				collapsed: true
			}, {
				sticky: true
			} );
		},

		'test that _getCursorContainer returns correct element': function( editor ) {
			var correctContainer = editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ? editor.editable() :
				editor.editable().getParent();

			assert.areSame( correctContainer, CKEDITOR.plugins.copyformatting._getCursorContainer( editor ) );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
}() );
